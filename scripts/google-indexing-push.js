const { GoogleAuth } = require('google-auth-library');
const fs = require('fs');
const path = require('path');

// 读取 keywords.json 文件
const keywordsPath = path.join(__dirname, '../src/data/keywords.json');
const keywords = JSON.parse(fs.readFileSync(keywordsPath, 'utf8'));

// 生成所有 URL
const allUrls = [];
const baseUrl = 'https://stopsaas.wangdadi.xyz';

// 添加核心页面
allUrls.push(baseUrl);
allUrls.push(`${baseUrl}/solutions`);

// 添加详情页
keywords.forEach(keyword => {
  allUrls.push(`${baseUrl}/solutions/${keyword.slug}`);
});

console.log(`Found ${allUrls.length} URLs to submit to Google Indexing API`);

// Google Indexing API 配置
const API_ENDPOINT = 'https://indexing.googleapis.com/v3/urlNotifications:publish';
const SERVICE_ACCOUNT_FILE = path.join(__dirname, 'service-account.json');

// 检查 service-account.json 文件是否存在
if (!fs.existsSync(SERVICE_ACCOUNT_FILE)) {
  console.error('Error: service-account.json file not found in scripts directory');
  console.error('Please create a service-account.json file with your Google Cloud service account credentials');
  process.exit(1);
}

// 读取服务账号信息
const serviceAccount = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_FILE, 'utf8'));
console.log(`Using service account: ${serviceAccount.client_email}`);
console.log(`Project ID: ${serviceAccount.project_id}\n`);

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
    console.log(`✓ Success: ${url}`);
    return true;
  } catch (error) {
    console.error(`✗ Error: ${url}`);
    console.error(`  Message: ${error.message}`);
    if (error.response && error.response.data) {
      console.error(`  Details: ${JSON.stringify(error.response.data)}`);
    }
    return false;
  }
}

// 主函数
async function main() {
  try {
    const client = await createAuthClient();
    let successCount = 0;
    let errorCount = 0;

    console.log(`Starting URL submission to Google Indexing API...`);
    console.log(`Total URLs to submit: ${allUrls.length}\n`);

    // 先测试第一个 URL
    console.log('Testing first URL to check permissions...');
    const firstUrl = allUrls[0];
    const testSuccess = await submitUrl(client, firstUrl);
    
    if (!testSuccess) {
      console.log('\n⚠️  First URL submission failed. This might be due to:');
      console.log('1. Google Search Console verification not yet completed');
      console.log('2. Service account not added as Owner in Google Search Console');
      console.log('3. URL ownership verification still in progress');
      console.log('\nPlease check:');
      console.log('- Google Search Console: https://search.google.com/search-console');
      console.log('- Verify that the site is verified');
      console.log('- Verify that the service account is added as Owner');
      console.log('- Wait a few minutes for verification to propagate');
      process.exit(1);
    }

    console.log('\n✓ First URL submission successful! Continuing with remaining URLs...\n');

    for (let i = 1; i < allUrls.length; i++) {
      const url = allUrls[i];
      const success = await submitUrl(client, url);
      if (success) {
        successCount++;
      } else {
        errorCount++;
      }

      // 每隔10秒提交一个 URL
      if (i < allUrls.length - 1) {
        console.log(`Waiting 10 seconds before next submission... (${i + 1}/${allUrls.length})\n`);
        await new Promise(resolve => setTimeout(resolve, 10000));
      }
    }

    console.log(`\n=== Script completed! ===`);
    console.log(`Successfully submitted: ${successCount + 1} URLs (including test)`);
    console.log(`Failed to submit: ${errorCount} URLs`);
    console.log(`Total: ${allUrls.length} URLs`);
  } catch (error) {
    console.error('Error:', error);
  }
}

// 运行主函数
main();