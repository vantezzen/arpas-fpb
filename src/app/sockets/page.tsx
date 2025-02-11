"use client";
import { useState } from "react";
import io from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Label,
} from "recharts";

const socket = io();
const NUM_ROUNDS = 100;
const WARMUP_ROUNDS = 10;

const WebSocketBenchmark = () => {
  const [results, setResults] = useState<number[]>([]);
  const [isBenchmarking, setIsBenchmarking] = useState(false);

  const startBenchmark = async () => {
    // The first few messages seem to take longer, so we warm up the connection
    for (let i = 0; i < WARMUP_ROUNDS; i++) {
      socket.emit("ping");
      await new Promise<void>((resolve) => {
        socket.once("pong", () => resolve());
      });
    }

    setResults([]);
    setIsBenchmarking(true);
    const newResults: number[] = [];

    for (let i = 0; i < NUM_ROUNDS; i++) {
      const start = performance.now();
      socket.emit("ping");
      await new Promise<void>((resolve) => {
        socket.once("pong", () => {
          const end = performance.now();
          newResults.push(end - start);
          resolve();
        });
      });
    }
    setResults(newResults);
    setIsBenchmarking(false);
  };

  const getStats = () => {
    if (results.length === 0) return null;
    const sorted = [...results].sort((a, b) => a - b);
    const sum = results.reduce((a, b) => a + b, 0);
    const mean = sum / results.length;
    const median = sorted[Math.floor(sorted.length / 2)];
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    return { mean, median, min, max };
  };

  const stats = getStats();

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>WebSocket Benchmark</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={startBenchmark} disabled={isBenchmarking}>
            {isBenchmarking ? "Benchmarking..." : "Start Benchmark"}
          </Button>
        </CardContent>
      </Card>

      {stats && (
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Mean: {stats.mean.toFixed(2)} ms</p>
            <p>Median: {stats.median.toFixed(2)} ms</p>
            <p>Min: {stats.min.toFixed(2)} ms</p>
            <p>Max: {stats.max.toFixed(2)} ms</p>
          </CardContent>
        </Card>
      )}

      {results.length > 0 && (
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Roundtrip Times</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={results.map((r, i) => ({ round: i + 1, time: r }))}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="round"
                  label={{
                    value: "Runde",
                    position: "insideBottom",
                    offset: -5,
                  }}
                />
                <YAxis>
                  <Label
                    value="Round-trip time (ms)"
                    offset={0}
                    angle={-90}
                    position="insideStart"
                    dx={-10}
                  />
                </YAxis>
                <Tooltip />
                <Bar dataKey="time" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WebSocketBenchmark;
