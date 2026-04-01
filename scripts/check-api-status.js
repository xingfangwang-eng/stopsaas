const { GoogleAuth } = require('google-auth-library');
const fs = require('fs');
const path = require('path');

// Google Cloud API 配置
const API_SERVICE_URL = 'https://serviceusage.googleapis.com/v1/services/indexing.googleapis.com';
const SERVICE_ACCOUNT_FILE = path.join(__dirname, 'service-account.json');

console.log('=== Google Cloud API Status Check ===\n');

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
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
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

// 检查 Indexing API 状态
async function checkIndexingApiStatus(client) {
  try {
    console.log('🌐 Checking Indexing API status...');
    
    const response = await client.request({
      url: `${API_SERVICE_URL}`,
      method: 'GET'
    });
    
    console.log('✅ API status retrieved successfully');
    console.log('📊 API Status:');
    console.log(`   Name: ${response.data.name}`);
    console.log(`   State: ${response.data.state}`);
    console.log(`   Parent: ${response.data.parent}`);
    
    if (response.data.state === 'ENABLED') {
      console.log('\n✅ Indexing API is ENABLED');
      return true;
    } else {
      console.log('\n❌ Indexing API is NOT ENABLED');
      console.log(`   Current state: ${response.data.state}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Failed to check API status');
    console.log(`   Error: ${error.message}`);
    if (error.response && error.response.data) {
      console.log(`   Details: ${JSON.stringify(error.response.data)}`);
    }
    return false;
  }
}

// 主函数
async function main() {
  try {
    const client = await createAuthClient();
    const apiEnabled = await checkIndexingApiStatus(client);
    
    console.log('\n=== Summary ===');
    if (apiEnabled) {
      console.log('✅ Indexing API is properly enabled');
      console.log('\n🔍 Possible issues:');
      console.log('1. Google Search Console verification not completed');
      console.log('2. Service account permissions not yet propagated');
      console.log('3. Property ownership not properly set');
      console.log('\n⏰ Recommendation:');
      console.log('Wait 60 minutes for full propagation and try again');
    } else {
      console.log('❌ Indexing API is not enabled');
      console.log('\n🔍 Next steps:');
      console.log('1. Visit Google Cloud Console: https://console.cloud.google.com');
      console.log('2. Go to APIs & Services > Library');
      console.log('3. Search for "Indexing API"');
      console.log('4. Click "Enable"');
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

// 运行主函数
main();