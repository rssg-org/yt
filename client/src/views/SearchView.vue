<template>
  <div>
    <div v-if="loading" class="loading">読み込み中...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <VideoList
      v-if="!loading && !error && videos.length"
      :videos="videos"
      :title="`検索結果: ${query}`"
    />

    <div v-if="!loading && !error && videos.length === 0" class="no-results">
      検索結果が見つかりませんでした。
    </div>
  </div>
</template>

<script>
import VideoList from "@/components/VideoList.vue";
import { apiurl } from "@/api";

export default {
  components: { VideoList },
  props: {
    query: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      videos: [],
      loading: false,
      error: null,
    };
  },
  watch: {
    query: {
      immediate: true,
      handler(newQuery) {
        document.title = newQuery ? `${newQuery} - 検索` : "検索結果";

        if (newQuery) {
          this.fetchSearchResults(newQuery);
        } else {
          this.videos = [];
        }
      },
    },
  },
  methods: {
    async fetchSearchResults(q) {
      this.loading = true;
      this.error = null;

      const baseUrl = `${apiurl()}?q=${encodeURIComponent(q)}`;

      try {
        // 指示通り fetch をこの形で呼ぶ
        const res = await fetch(`${baseUrl}`);

        if (!res.ok) {
          this.error = `検索APIの取得に失敗しました (HTTP ${res.status})`;
          this.videos = [];
          return;
        }

        const ct = (res.headers.get("content-type") || "").toLowerCase();
        if (!ct.includes("application/json") && !ct.includes("text/json")) {
          this.error = "検索APIはJSONを返しませんでした";
          this.videos = [];
          return;
        }

        const data = await res.json();
        this.videos = Array.isArray(data.results) ? data.results : (Array.isArray(data) ? data : []);
      } catch (e) {
        this.error = "検索APIの取得に失敗しました";
        console.warn("fetch error:", e);
        this.videos = [];
      } finally {
        this.loading = false;
      }
    },
     },
};
</script>

<style scoped>
.loading {
  padding: 1rem;
  text-align: center;
}
.error {
  color: red;
  padding: 1rem;
}
.no-results {
  padding: 1rem;
  text-align: center;
  color: #666;
}
</style>
