const { GoogleAuth } = require('google-auth-library');
const fs = require('fs');
const path = require('path');

// 读取 sitemap.ts 文件
const sitemapPath = path.join(__dirname, '../src/app/sitemap.ts');
const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');

// 提取 baseUrl 和 keywords 导入
const baseUrlMatch = sitemapContent.match(/const baseUrl = '(.*)';/);
const baseUrl = baseUrlMatch ? baseUrlMatch[1] : 'https://stopsaas.com';

// 读取 keywords.json 文件
const keywordsPath = path.join(__dirname, '../src/data/keywords.json');
const keywords = JSON.parse(fs.readFileSync(keywordsPath, 'utf8'));

// 生成所有 URL
const allUrls = [];

// 添加核心页面
allUrls.push(baseUrl);
allUrls.push(`${baseUrl}/solutions`);

// 添加详情页
keywords.forEach(keyword => {
  allUrls.push(`${baseUrl}/${keyword.slug}`);
});

console.log(`Found ${allUrls.length} URLs in sitemap`);

// Google Indexing API 配置
const API_ENDPOINT = 'https://indexing.googleapis.com/v3/urlNotifications:publish';
const SERVICE_ACCOUNT_FILE = path.join(__dirname, 'service-account.json');

// 检查 service-account.json 文件是否存在
if (!fs.existsSync(SERVICE_ACCOUNT_FILE)) {
  console.error('Error: service-account.json file not found in scripts directory');
  console.error('Please create a service-account.json file with your Google Cloud service account credentials');
  process.exit(1);
}

// 创建认证客户端
async function createAuthClient() {
  const auth = new GoogleAuth({
    keyFile: SERVICE_ACCOUNT_FILE,
    scopes: ['https://www.googleapis.com/auth/indexing'],
  });
  return await auth.getClient();
}

// 提交 URL 到 Google Indexing API
async function submitUrl(client, url) {
  try {
    const response = await client.request({
      url: API_ENDPOINT,
      method: 'POST',
      data: {
        url: url,
        type: 'URL_UPDATED'
      }
    });
    console.log(`Successfully submitted: ${url}`);
    return true;
  } catch (error) {
    console.error(`Error submitting ${url}:`, error.message);
    return false;
  }
}

// 主函数
async function main() {
  try {
    const client = await createAuthClient();
    let successCount = 0;

    for (let i = 0; i < allUrls.length; i++) {
      const url = allUrls[i];
      const success = await submitUrl(client, url);
      if (success) {
        successCount++;
      }

      // 每隔10秒提交一个 URL
      if (i < allUrls.length - 1) {
        console.log('Waiting 10 seconds before next submission...');
        await new Promise(resolve => setTimeout(resolve, 10000));
      }
    }

    console.log(`\nScript completed!`);
    console.log(`Successfully submitted ${successCount} out of ${allUrls.length} URLs`);
  } catch (error) {
    console.error('Error:', error);
  }
}

// 运行主函数
main();
