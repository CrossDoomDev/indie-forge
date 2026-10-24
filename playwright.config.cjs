const {defineConfig}=require('@playwright/test');
module.exports=defineConfig({
 testDir:'./tests',timeout:25000,workers:1,reporter:'list',
 use:{baseURL:'http://127.0.0.1:5173',browserName:'chromium',headless:true,launchOptions:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH}:{}},
 webServer:{command:'node serve.cjs',url:'http://127.0.0.1:5173',reuseExistingServer:!process.env.CI,timeout:30000}
});
