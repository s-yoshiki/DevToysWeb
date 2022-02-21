import {
  StarBorder,
  Cached,
  Filter1,
  Code,
  Home,
  NetworkCheck,
  TextDecrease,
  AutoFixHigh,
} from '@mui/icons-material';

interface ServiceChildElement {
  path: string;
  name: string;
  desc?: string;
  icon?: any,
}

interface ServiceElement {
  path?: string;
  name?: string;
  child: Array<ServiceChildElement>;
  icon?: any,
}



const items: Array<ServiceElement> = [
  {
    path: "/",
    name: "All Tools",
    child: [],
    icon: <Home />,
  },
  {
    name: "Converters",
    icon: <Cached />,
    child: [
      {
        path: "/items/converters/yaml2json",
        name: "YAML <> JSON",
        desc: 'Convert JSON data to YAML',
      },
      {
        path: "/items/converters/number_base",
        name: "Number Base",
        desc: 'Convert numbers from one base to another',
      },
      {
        path: "/items/converters/date",
        name: "Date",
        desc: 'Convert date to other format',
      },
      {
        path: "/items/converters/angle",
        name: "Angle",
      },
    ],
  },
  {
    name: "Encode & Decode",
    icon: <Filter1 />,
    child: [
      {
        path: "/items/encode_decode/html",
        name: "HTML Escape",
      },
      {
        path: "/items/encode_decode/base64",
        name: "Base64",
      },
      {
        path: "/items/encode_decode/url",
        name: "URL",
      },
      {
        path: "/items/encode_decode/crypto",
        name: "Crypto",
      },
      {
        path: "/items/encode_decode/jwt",
        name: "JWT",
      },
    ],
  },
  {
    name: "Formatters",
    icon: <AutoFixHigh />,
    child: [
      {
        path: "/items/formatters/json",
        name: "JSON",
      },
      {
        path: "/items/formatters/xml",
        name: "XML",
      },
      {
        path: "/items/formatters/sql",
        name: "SQL",
      },
    ],
  },
  {
    name: "Generater",
    icon: <Code />,
    child: [
      {
        path: "/items/generater/hash",
        name: "Hash",
      },
      {
        path: "/items/generater/uuid",
        name: "UUID",
      },
      {
        path: "/items/generater/password",
        name: "Password",
      }
    ],
  },
  {
    name: "Text",
    icon: <TextDecrease />,
    child: [
      {
        path: "/items/text/regex",
        name: "Regex",
      },
    ],
  },
  // {
  //   name: "Network",
  //   icon: <NetworkCheck />,
  //   child: [
  //     {
  //       path: "/items/network/info",
  //       name: "Infomation",
  //     },
  //   ],
  // },
];

export const getChilds = (): Array<any> => {
  let result = []
  for (let i = 0; i < items.length; i++) {
    let category = items[i].name
    for (let j = 0; j < items[i].child.length; j++) {
      let tmp: any = {
        ...items[i].child[j],
        category,
      }
      result.push(tmp)
    }
  }
  return result
}

export default items;
