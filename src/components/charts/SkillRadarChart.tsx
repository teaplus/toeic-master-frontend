import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { TestHistory } from "../../types/user";

interface SkillRadarChartProps {
  testHistory?: TestHistory;
}

const SkillRadarChart: React.FC<SkillRadarChartProps> = ({ testHistory }) => {
  const getSkillRadarOptions = useMemo(() => {
    const analysisScores = testHistory?.stats?.analysisScores || {
      listening: 0,
      reading: 0,
      grammar: 0,
      comprehension: 0,
    };

    return {
      radar: {
        indicator: [
          { name: "Listening", max: 100 },
          { name: "Reading", max: 100 },
          { name: "Grammar", max: 100 },
          { name: "Comprehension", max: 100 },
        ],
        splitArea: {
          areaStyle: {
            color: ["rgba(255,255,255,0.05)"],
          },
        },
        axisLine: {
          lineStyle: {
            color: "rgba(255,255,255,0.2)",
          },
        },
        splitLine: {
          lineStyle: {
            color: "rgba(255,255,255,0.2)",
          },
        },
      },
      series: [
        {
          type: "radar",
          data: [
            {
              value: [
                analysisScores.listening,
                analysisScores.reading,
                analysisScores.grammar,
                analysisScores.comprehension,
              ],
              name: "Skill Analysis",
              areaStyle: {
                color: "rgba(59, 130, 246, 0.3)",
              },
              lineStyle: {
                color: "#3B82F6",
                width: 2,
              },
              itemStyle: {
                color: "#3B82F6",
              },
            },
          ],
        },
      ],
      backgroundColor: "transparent",
    };
  }, [testHistory?.stats?.analysisScores]);

  if (!testHistory?.stats?.analysisScores) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <p className="text-gray-400">Chưa có dữ liệu phân tích kỹ năng</p>
      </div>
    );
  }

  return (
    <ReactECharts
      option={getSkillRadarOptions}
      style={{ height: "300px", width: "100%" }}
      theme="dark"
    />
  );
};

export default SkillRadarChart;
