const axios = require('axios');

const mailchimpAPIKey = process.env.MC_API_KEY;
const audienceID = process.env.MC_AUDIENCE_ID;
const serverPrefix = 'us21';

async function rhp_list_subscribers(req, res) {
  try {
    // 调用 Mailchimp API 获取所有成员
    const response = await axios.get(
      `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${audienceID}/members`,
      {
        headers: {
          Authorization: `apikey ${mailchimpAPIKey}`,
        },
        params: {
          count: 1000, // 返回最多 1000 条
        }
      }
    );

    // 过滤包含 "Roseneath Holiday Park" 或 "Little Hottlier" 标签的订阅者
    const subscribers = response.data.members
      .filter(member => member.tags.some(tag => {
        const tagLower = tag.name.toLowerCase();
        return tagLower.includes('roseneath') || tagLower.includes('hottlier');
      }))
      .map(member => ({
        email: member.email_address,
        name: (member.merge_fields?.FNAME || '') + ' ' + (member.merge_fields?.LNAME || ''),
        status: member.status,
        tags: member.tags.map(t => t.name)
      }));

    res.status(200).json({ 
      count: subscribers.length,
      subscribers 
    });
  } catch (error) {
    console.error('[roseneathpark/list_subscribers] Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch subscribers', details: error.message });
  }
}

module.exports = { rhp_list_subscribers };
