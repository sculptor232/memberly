import moment from "moment";
import i18n from "i18next";
export const monthAxis = () => {
  if (localStorage.getItem("lng") === "zh") {
    let axis = [];
    for (let i = 1; i <= 12; i++) {
      axis.push(`${i}月`);
    }
    return axis;
  } else {
    return [
      "JAN",
      "FEB",
      "MAT",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];
  }
};
export const dayAxis = () => {
  let maxDay = moment().daysInMonth();
  let axis = [];
  for (let i = 1; i <= maxDay; i++) {
    axis.push(`${i}`);
  }
  return axis;
};
export const weekAxis = () => {
  if (localStorage.getItem("lng") === "zh") {
    let axis = [];
    for (let i = 1; i <= 7; i++) {
      axis.push(`周${romanToChinese(i)}`);
    }
    return axis;
  } else {
    return ["MON", "THU", "WES", "THR", "FRI", "SAT", "SUN"];
  }
};
export const romanToChinese = (num) => {
  let Chinese = "";
  switch (num) {
    case 1:
      Chinese = "一";
      break;
    case 2:
      Chinese = "二";
      break;
    case 3:
      Chinese = "三";
      break;
    case 4:
      Chinese = "四";
      break;
    case 5:
      Chinese = "五";
      break;
    case 6:
      Chinese = "六";
      break;
    case 7:
      Chinese = "日";
      break;
    default:
      break;
  }
  return Chinese;
};
const xAxisOption = (range) => {
  return [
    {
      type: "category",
      show: true,
      data:
        range === "year"
          ? monthAxis()
          : range === "month"
          ? dayAxis()
          : weekAxis(),
    },
  ];
};
const seriesOption = (catergory, range, data) => {
  return [
    {
      name:
        catergory === "sales"
          ? i18n.t("Sales")
          : catergory === "visits"
          ? i18n.t("Visits")
          : i18n.t("Orders"),
      type: "bar",
      data: data,
      itemStyle: {
        normal: {
          // 设置柱状图颜色
          color: "#58AFFF",
          // 以下为是否显示，显示位置和显示格式的设置了
          label: {
            show: false,
            position: "top",
            formatter: "{c}",
            // formatter: '{b}\n{c}'
          },
        },
      },
      barWidth:
        range === "week"
          ? 40
          : range === "month"
          ? 15
          : range === "year"
          ? 30
          : null,
    },
    // 设置柱的宽度，要是数据太少，柱子太宽不美观~
  ];
};
const barChartData = {
  backgroundColor: "#fff",
  // title: {
  //   top: 30,
  //   text: "柱状图",
  //   textStyle: {
  //     fontWeight: "normal",
  //     fontSize: 16,
  //     color: "#57617B"
  //   },
  //   left: "center"
  // },
  tooltip: {
    trigger: "axis",
  },
  grid: {
    top: "2%",
    left: "0%",
    right: "0.5%",
    bottom: "0%",
    containLabel: true,
    show: false,
  },
  // x轴
  yAxis: [
    {
      type: "value",
      show: true,
      axisLabel: {
        formatter: "{value}",
      },
    },
  ],
};
export function chartData(catergory, range, data) {
  return {
    ...barChartData,
    xAxis: xAxisOption(range),
    series: seriesOption(catergory, range, data),
  };
}
