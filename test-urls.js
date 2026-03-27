const axios = require('axios');

// 要测试的 URL 列表
const urls = [
  'https://stopsaas.com',
  'https://stopsaas.com/og-image.png',
  'https://schema.org'
];

// 测试 URL 函数
async function testUrls() {
  console.log('Testing URLs...\n');
  
  for (const url of urls) {
    try {
      const response = await axios.get(url, {
        timeout: 5000,
        validateStatus: (status) => status < 500 // 只把 500+ 视为错误
      });
      
      console.log(`✅ ${url} - Status: ${response.status}`);
      if (response.status !== 200) {
        console.log(`   ⚠️  Expected 200, got ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${url} - Error: ${error.message}`);
    }
  }
  
  console.log('\nTesting local API endpoint...');
  try {
    const response = await axios.post('http://localhost:3000/api/strip', {
      input: 'I use Salesforce just for storing leads'
    }, {
      timeout: 10000
    });
    console.log('✅ http://localhost:3000/api/strip - Status: 200');
    console.log('   Response received successfully');
  } catch (error) {
    console.log(`❌ http://localhost:3000/api/strip - Error: ${error.message}`);
    console.log('   Note: This may fail if the development server is not running');
  }
}

testUrls();
