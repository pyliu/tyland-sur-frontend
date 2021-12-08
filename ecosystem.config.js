module.exports = {
  apps: [{
    // App 名稱
    name: 'tyland-sur-fe',
    // 分為 cluster 以及 fork 模式
    exec_mode: 'cluster',
    instances: 1,
    // 執行服務的入口檔案
    script: './/node_modules/nuxt/bin/nuxt.js',
    args: '',
    out_file: '../tyland-sur-frontend_out.log',
    error_file: '../tyland-sur-frontend_err.log',
    // 'cron' 模式指定重啟時間，只支持 cluster 模式
    cron_restart: '0 7 * * *',
    // log 顯示時間
    time: true,
    // 適合開發時用，檔案一有變更就會自動重啟
    watch: true,
    ignore_watch: ['[/\\]./', 'node_modules', '.git'],
    max_memory_restart: '1024M',
    env: {
      NODE_ENV: 'production'
    },
    wait_ready: true,
    restart_delay: 5000
  }]
}
