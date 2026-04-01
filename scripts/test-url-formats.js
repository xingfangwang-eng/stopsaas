const { GoogleAuth } = require('google-auth-library');
const fs = require('fs');
const path = require('path');

// Google Indexing API 配置
const API_ENDPOINT = 'https://indexing.googleapis.com/v3/urlNotifications:publish';
const SERVICE_ACCOUNT_FILE = path.join(__dirname, 'service-account.json');

console.log('=== Google Indexing API URL Format Test ===\n');

// 检查 service-account.json 文件是否存在
if (!fs.existsSync(SERVICE_ACCOUNT_FILE)) {
  console.error('❌ Error: service-account.json file not found in scripts directory');
  process.exit(1);
}

// 读取服务账号信息
const serviceAccount = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_FILE, 'utf8'));
console.log('📋 Service Account Information:');
console.log(`   Email: ${serviceAccount.client_email}`);
console.log(`   Project ID: ${serviceAccount.project_id}\n`);

// 创建认证客户端
async function createAuthClient() {
  try {
    console.log('🔐 Creating authentication client...');
    const auth = new GoogleAuth({
      keyFile: SERVICE_ACCOUNT_FILE,
      scopes: ['https://www.googleapis.com/auth/indexing'],
    });
    const client = await auth.getClient();
    console.log('✅ Authentication client created successfully\n');
    return client;
  } catch (error) {
    console.log('❌ Failed to create authentication client');
    console.log(`   Error: ${error.message}\n`);
    throw error;
  }
}

// 测试 API 连接
async function testUrl(client, url) {
  try {
    console.log(`🌐 Testing URL: ${url}`);
    
    const response = await client.request({
      url: API_ENDPOINT,
      method: 'POST',
      data: {
        url: url,
        type: 'URL_UPDATED'
      }
    });
    
    console.log('✅ Success! URL ownership verified\n');
    return true;
  } catch (error) {
    console.log('❌ Failed');
    console.log(`   Error: ${error.message}\n`);
    return false;
  }
}

// 主函数
async function main() {
  try {
    const client = await createAuthClient();
    
    // 测试不同的 URL 格式
    const testUrls = [
      'https://stopsaas.wangdadi.xyz',
      'https://www.stopsaas.wangdadi.xyz',
      'https://stopsaas.wangdadi.xyz/',
      'https://stopsaas.wangdadi.xyz/solutions'
    ];
    
    console.log('🧪 Testing different URL formats...\n');
    
    let successCount = 0;
    for (const url of testUrls) {
      const success = await testUrl(client, url);
      if (success) {
        successCount++;
      }
    }
    
    console.log('📊 Test Results:');
    console.log(`   Total URLs tested: ${testUrls.length}`);
    console.log(`   Successful: ${successCount}`);
    console.log(`   Failed: ${testUrls.length - successCount}`);
    
    if (successCount > 0) {
      console.log('\n✅ Some URLs were successful!');
      console.log('You can use the successful URL format in the main script.');
    } else {
      console.log('\n❌ All URL formats failed.');
      console.log('Possible reasons:');
      console.log('1. Google Search Console property format mismatch');
      console.log('2. Service account permissions not yet propagated');
      console.log('3. Indexing API not properly enabled');
      console.log('4. Verification still pending');
      
      console.log('\n🔍 Next steps:');
      console.log('1. Check Google Search Console property format');
      console.log('2. Wait 60 minutes for full propagation');
      console.log('3. Double-check service account permissions');
      console.log('4. Verify Indexing API is enabled');
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

// 运行主函数
main();