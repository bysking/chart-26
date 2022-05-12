export const STAT = {
  wait_test: "1",
  yin: "2",
  yang: "3",
};

function getCount(num = 3) {
  return new Array(num).fill(1).map((item, index) => {
    return {
      id: index,
      results: {
        yin: 0,
        yang: 0,
      },
    };
  });
}

export const peopleTypeOptions = [
  {
    label: "有人居住",
    value: "zh",
  },
  {
    label: "无人居住",
    value: "no",
  },
  {
    label: "居委",
    value: "jw",
  },
];

export const HOUSE_LIST = [
  {
    name: "101室",
    members: 2,
    type: "zh",
    count: getCount(),
  },
  {
    name: "102室",
    members: 1,
    type: "zh",
    count: getCount(),
  },
  {
    name: "103室",
    members: 0,
    type: "jw",
    note: "居委",
    count: getCount(),
  },
  {
    name: "104室",
    members: 4,
    type: "zh",
    count: getCount(),
  },
  {
    // 2楼
    name: "201室",
    members: 2,
    type: "zh",
    count: getCount(),
  },
  {
    name: "202室",
    members: 0,
    type: "no",
    note: "无人",
    count: getCount(),
  },
  {
    name: "203室",
    members: 0,
    type: "no",
    note: "无人",
    count: getCount(),
  },
  {
    name: "204室",
    members: 1,
    type: "zh",
    count: getCount(),
  },
  {
    // 3楼
    name: "301室",
    members: 2,
    type: "zh",
    count: getCount(),
  },
  {
    name: "302室 -",
    members: 0,
    type: "no",
    note: "-",
    count: getCount(),
  },
  {
    name: "303室",
    members: 1,
    type: "no",
    note: "无人",
    count: getCount(),
  },
  {
    name: "304室-",
    members: 1,
    type: "zh",
    count: getCount(),
  },
  {
    // 4楼
    name: "401室",
    members: 2,
    type: "zh",
    count: getCount(),
  },
  {
    name: "402室",
    members: 0,
    type: "no",
    note: "无人",
    count: getCount(),
  },
  {
    name: "403室",
    members: 2,
    type: "zh",
    count: getCount(),
  },
  {
    name: "404室",
    members: 3,
    type: "zh",
    count: getCount(),
  },
  {
    // 5楼
    name: "501室",
    members: 1,
    type: "zh",
    count: getCount(),
  },
  {
    name: "502室",
    members: 1,
    type: "zh",
    count: getCount(),
  },
  {
    name: "503室",
    members: 3,
    type: "zh",
    count: getCount(),
  },
  {
    name: "504室",
    members: 2,
    type: "zh",
    count: getCount(),
  },
  {
    // 6楼
    name: "601室",
    members: 1,
    type: "zh",
    count: getCount(),
  },
  {
    name: "602室",
    members: 4,
    type: "zh",
    count: getCount(),
  },
  {
    name: "603室",
    members: 0,
    type: "no",
    note: "无人",
    count: getCount(),
  },
  {
    name: "604室",
    members: 2,
    type: "zh",
    count: getCount(),
  },
  {
    // 7楼
    name: "701室",
    members: 1,
    type: "zh",
    count: getCount(),
  },
  {
    name: "702室",
    members: 1,
    type: "zh",
    count: getCount(),
  },
  {
    name: "703室",
    members: 2,
    type: "zh",
    count: getCount(),
  },
];
