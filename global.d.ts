declare module '*.png';
declare module '*.gif';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.css';
declare module '*.less';

declare namespace JSX {
  interface IntrinsicElements {
    import: React.DetailedHTMLProps<React.EmbedHTMLAttributes<HTMLEmbedElement>, HTMLEmbedElement>;
  }
}

interface Global {
  $token?: string;
}

interface Pagination {
  current: number;
  pageSize: number;
  pageTotal: number;
}

interface ShareConfig {
  title?: string;
  path?: string;
  imageUrl?: string;
}

// @ts-ignore
declare const process: {
  env: {
    TARO_ENV: 'weapp' | 'swan' | 'alipay' | 'h5' | 'rn' | 'tt' | 'quickapp' | 'qq';
    [key: string]: any;
  };
};
