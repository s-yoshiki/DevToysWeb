import {
  StarBorder,
  Cached,
  Filter1,
  Code,
  Home,
  NetworkCheck,
  TextDecrease,
} from '@mui/icons-material';

interface ServiceElement {
  path?: string;
  name?: string;
  child?: Array<ServiceElement>;
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
      },
      {
        path: "/items/converters/number_base",
        name: "Number Base",
      },
      {
        path: "/items/converters/date",
        name: "Date",
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
    icon: <Code />,
    child: [
      {
        path: "/items/formatters/json",
        name: "JSON",
      },
      {
        path: "/items/formatters/sql",
        name: "SQL",
      }
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

export default items;
