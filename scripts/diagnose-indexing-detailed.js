const { GoogleAuth } = require('google-auth-library');
const fs = require('fs');
const path = require('path');

// Google Indexing API 配置
const API_ENDPOINT = 'https://indexing.googleapis.com/v3/urlNotifications:publish';
const SERVICE_ACCOUNT_FILE = path.join(__dirname, 'service-account.json');

console.log('=== Google Indexing API Detailed Diagnostic Tool ===\n');

// 检查 service-account.json 文件是否存在
if (!fs.existsSync(SERVICE_ACCOUNT_FILE)) {
  console.error('❌ Error: service-account.json file not found in scripts directory');
  process.exit(1);
}

// 读取服务账号信息
const serviceAccount = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_FILE, 'utf8'));
console.log('📋 Service Account Information:');
console.log(`   Email: ${serviceAccount.client_email}`);
console.log(`   Project ID: ${serviceAccount.project_id}`);
console.log(`   Client ID: ${serviceAccount.client_id}`);
console.log(`   Auth URI: ${serviceAccount.auth_uri}`);
console.log(`   Token URI: ${serviceAccount.token_uri}\n`);

// 检查私钥格式
if (serviceAccount.private_key) {
  console.log('✅ Private key found in service-account.json');
  if (serviceAccount.private_key.includes('BEGIN PRIVATE KEY')) {
    console.log('✅ Private key format is correct\n');
  } else {
    console.log('❌ Private key format is incorrect\n');
  }
} else {
  console.log('❌ Private key not found in service-account.json\n');
}

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
async function testApiConnection(client) {
  try {
    console.log('🌐 Testing Google Indexing API connection...');
    console.log(`   Endpoint: ${API_ENDPOINT}`);
    console.log(`   Method: POST`);
    console.log(`   URL: https://stopsaas.wangdadi.xyz\n`);
    
    const response = await client.request({
      url: API_ENDPOINT,
      method: 'POST',
      data: {
        url: 'https://stopsaas.wangdadi.xyz',
        type: 'URL_UPDATED'
      }
    });
    
    console.log('✅ API connection successful!');
    console.log('✅ URL ownership verified!');
    console.log('✅ Service account has correct permissions!\n');
    console.log('📊 Response Details:');
    console.log(`   Status: ${response.status}`);
    console.log(`   Data: ${JSON.stringify(response.data)}\n`);
    return true;
  } catch (error) {
    console.log('❌ API connection failed or permission denied\n');
    console.log('📋 Error Details:');
    console.log(`   Status Code: ${error.code || 'Unknown'}`);
    console.log(`   Message: ${error.message}`);
    
    if (error.response) {
      console.log(`   Response Status: ${error.response.status}`);
      if (error.response.data) {
        console.log(`   Error Code: ${error.response.data.error?.code}`);
        console.log(`   Error Status: ${error.response.data.error?.status}`);
        console.log(`   Error Message: ${error.response.data.error?.message}`);
        
        if (error.response.data.error?.errors) {
          console.log(`   Errors:`);
          error.response.data.error.errors.forEach((err, index) => {
            console.log(`     ${index + 1}. ${err.message}`);
            console.log(`        Domain: ${err.domain}`);
            console.log(`        Reason: ${err.reason}`);
          });
        }
      }
    }
    
    console.log('\n🔍 Troubleshooting Guide:');
    console.log('1. Google Search Console Setup:');
    console.log('   - Visit: https://search.google.com/search-console');
    console.log('   - Add property: https://stopsaas.wangdadi.xyz');
    console.log('   - Verify ownership (HTML file method recommended)');
    console.log('   - Add service account as Owner:');
    console.log('     Email: google-indexing-api@wangxf08921-178310.iam.gserviceaccount.com');
    console.log('     Role: Owner (not Viewer or Editor)');
    console.log('     Make sure to save changes');
    
    console.log('\n2. Google Cloud Console Setup:');
    console.log('   - Visit: https://console.cloud.google.com');
    console.log('   - Select project: wangxf08921-178310');
    console.log('   - Enable Indexing API:');
    console.log('     Go to APIs & Services > Library');
    console.log('     Search for "Indexing API"');
    console.log('     Click "Enable"');
    console.log('   - Verify service account permissions:');
    console.log('     Go to IAM & Admin > Service Accounts');
    console.log('     Check that service account has "Service Account Token Creator" role');
    
    console.log('\n3. Wait for Propagation:');
    console.log('   - Google Search Console changes: 5-15 minutes');
    console.log('   - Service account permissions: 5-10 minutes');
    console.log('   - API enablement: 1-5 minutes');
    console.log('   - Total wait time: 15-30 minutes recommended');
    
    console.log('\n4. Alternative Solutions:');
    console.log('   - Try using DNS TXT record verification');
    console.log('   - Try using Google Analytics verification');
    console.log('   - Try using Google Tag Manager verification');
    console.log('   - Contact Google Support if issue persists');
    
    console.log('\n5. Testing Steps:');
    console.log('   - Run this diagnostic script again in 15-30 minutes');
    console.log('   - If still failing, check Google Cloud Console logs');
    console.log('   - Verify service account has correct permissions');
    console.log('   - Try testing with a different URL');
    
    return false;
  }
}

// 主函数
async function main() {
  try {
    const client = await createAuthClient();
    const success = await testApiConnection(client);
    
    if (success) {
      console.log('=== ✅ Ready to Submit URLs ===');
      console.log('You can now run: node scripts/google-indexing-push.js');
      console.log('This will submit all 102 URLs to Google Indexing API');
    } else {
      console.log('\n=== ❌ Please Fix Issues Above Before Proceeding ===');
      console.log('Wait 15-30 minutes and run this diagnostic script again');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

// 运行主函数
main();