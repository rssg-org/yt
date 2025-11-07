// APIエンドポイント、全部アカウント変えて作ってる
const API_URLS = [
  "https://script.google.com/macros/s/AKfycbzm1xAoCAuYyeNKpKSB_ENMaYXmK1h60PjGk3TlWkXSnFUVtgKnShRmRk1WoElwPGJ_-Q/exec"
];

// ランダムに1つ返す関数
export function apiurl() {
  const index = Math.floor(Math.random() * API_URLS.length);
  return API_URLS[index];
}
