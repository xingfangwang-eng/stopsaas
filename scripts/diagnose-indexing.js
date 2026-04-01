const { GoogleAuth } = require('google-auth-library');
const fs = require('fs');
const path = require('path');

// Google Indexing API 配置
const API_ENDPOINT = 'https://indexing.googleapis.com/v3/urlNotifications:publish';
const SERVICE_ACCOUNT_FILE = path.join(__dirname, 'service-account.json');

// 检查 service-account.json 文件是否存在
if (!fs.existsSync(SERVICE_ACCOUNT_FILE)) {
  console.error('Error: service-account.json file not found in scripts directory');
  process.exit(1);
}

// 读取服务账号信息
const serviceAccount = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_FILE, 'utf8'));
console.log('=== Google Indexing API Diagnostic Tool ===\n');
console.log(`Service Account: ${serviceAccount.client_email}`);
console.log(`Project ID: ${serviceAccount.project_id}`);
console.log(`Client ID: ${serviceAccount.client_id}\n`);

// 创建认证客户端
async function createAuthClient() {
  const auth = new GoogleAuth({
    keyFile: SERVICE_ACCOUNT_FILE,
    scopes: ['https://www.googleapis.com/auth/indexing'],
  });
  return await auth.getClient();
}

// 测试 API 连接
async function testApiConnection(client) {
  try {
    console.log('Testing Google Indexing API connection...');
    const response = await client.request({
      url: API_ENDPOINT,
      method: 'POST',
      data: {
        url: 'https://stopsaas.wangdadi.xyz',
        type: 'URL_UPDATED'
      }
    });
    console.log('✓ API connection successful!');
    console.log('✓ URL ownership verified!');
    console.log('✓ Service account has correct permissions!\n');
    return true;
  } catch (error) {
    console.log('✗ API connection failed or permission denied\n');
    console.log('Error Details:');
    console.log(`  Status Code: ${error.code || 'Unknown'}`);
    console.log(`  Message: ${error.message}`);
    
    if (error.response && error.response.data) {
      console.log(`  Error Code: ${error.response.data.error?.code}`);
      console.log(`  Error Status: ${error.response.data.error?.status}`);
      console.log(`  Error Message: ${error.response.data.error?.message}`);
    }
    
    console.log('\n=== Troubleshooting Steps ===');
    console.log('1. Check Google Search Console:');
    console.log('   - Visit: https://search.google.com/search-console');
    console.log('   - Verify that https://stopsaas.wangdadi.xyz is added');
    console.log('   - Check that the site is verified (HTML file method)');
    console.log('   - Verify that the service account is added as Owner');
    
    console.log('\n2. Service Account Permissions:');
    console.log('   - Email: google-indexing-api@wangxf08921-178310.iam.gserviceaccount.com');
    console.log('   - Role: Owner (not Viewer or Editor)');
    console.log('   - Make sure to save changes');
    
    console.log('\n3. Wait for Propagation:');
    console.log('   - Google Search Console changes may take 5-15 minutes to propagate');
    console.log('   - Service account permissions may take time to sync');
    console.log('   - Try running this script again in 10-15 minutes');
    
    console.log('\n4. Alternative Verification Methods:');
    console.log('   - Try using DNS TXT record verification');
    console.log('   - Try using Google Analytics verification');
    console.log('   - Try using Google Tag Manager verification');
    
    console.log('\n5. Check Google Cloud Console:');
    console.log('   - Visit: https://console.cloud.google.com');
    console.log('   - Check that Indexing API is enabled');
    console.log('   - Check service account permissions');
    
    return false;
  }
}

// 主函数
async function main() {
  try {
    const client = await createAuthClient();
    const success = await testApiConnection(client);
    
    if (success) {
      console.log('=== Ready to Submit URLs ===');
      console.log('You can now run: node scripts/google-indexing-push.js');
    } else {
      console.log('\n=== Please fix the issues above before proceeding ===');
      process.exit(1);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

// 运行主函数
main();