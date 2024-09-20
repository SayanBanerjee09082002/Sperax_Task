import axios from "axios";
import React, { useEffect, useState } from "react";
import { HistoricalChart } from "../Config/Api";
import { Line } from "react-chartjs-2";
import { Box, Spinner, Flex } from "@chakra-ui/react";
import SelectButton from "./SelectButton";
import { chartDays } from "../Config/Data";
import { CryptoState } from "../Config/CryptoContext";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from 'chart.js';

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  PointElement
);

const CoinInfo = ({ coin }) => {
  const [historicData, setHistoricData] = useState();
  const [days, setDays] = useState(1);
  const { currency } = CryptoState();
  const [flag, setFlag] = useState(false);

  const fetchHistoricData = async () => {
    const { data } = await axios.get(HistoricalChart(coin.id, days, currency));
    setFlag(true);
    setHistoricData(data.prices);
  };

  useEffect(() => {
    fetchHistoricData();
  }, [days, currency]);

  return (
    <Box p={4} borderWidth={1} borderRadius="md" borderColor="transparent" bg="transparent" color="white">
      {!historicData || !flag ? (
        <Flex justifyContent="center" alignItems="center" height="100vh">
          <Spinner size="xl" color="gold" />
        </Flex>
      ) : (
        <>
          <Box mb={4}>
            <Line
              data={{
                labels: historicData.map((coin) => {
                  let date = new Date(coin[0]);
                  let time =
                    date.getHours() > 12
                      ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                      : `${date.getHours()}:${date.getMinutes()} AM`;
                  return days === 1 ? time : date.toLocaleDateString();
                }),
                datasets: [
                  {
                    data: historicData.map((coin) => coin[1]),
                    label: `Price (Past ${days} Days) in ${currency}`,
                    borderColor: "#EEBC1D",
                  },
                ],
              }}
              options={{
                elements: {
                  point: {
                    radius: 1,
                  },
                },
              }}
            />
          </Box>
          <Flex mt={4} justifyContent="space-around" width="100%">
            {chartDays.map((day) => (
              <SelectButton
                key={day.value}
                onClick={() => {
                  setDays(day.value);
                  setFlag(false);
                }}
                selected={day.value === days}
              >
                {day.label}
              </SelectButton>
            ))}
          </Flex>
        </>
      )}
    </Box>
  );
};

export default CoinInfo;
