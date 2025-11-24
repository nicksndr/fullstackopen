#!/bin/bash

# Test script for blog API with token authentication

BASE_URL="http://localhost:3001"

echo "=== Testing Blog API ==="
echo ""

# 1. Login to get a token
echo "1. Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"mluukkai","password":"password123"}')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "ERROR: Failed to get token"
  echo "Response: $LOGIN_RESPONSE"
  exit 1
fi

echo "✓ Token obtained: ${TOKEN:0:20}..."
echo ""

# 2. Test creating a blog with token
echo "2. Creating a blog with token..."
CREATE_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST "$BASE_URL/api/blogs" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Test Blog Post",
    "author": "Test Author",
    "url": "https://test.com",
    "likes": 5
  }')

HTTP_CODE=$(echo "$CREATE_RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
BODY=$(echo "$CREATE_RESPONSE" | sed '/HTTP_CODE/d')

if [ "$HTTP_CODE" = "201" ]; then
  echo "✓ Blog created successfully"
  echo "Response: $BODY" | head -5
else
  echo "✗ Failed to create blog. HTTP Code: $HTTP_CODE"
  echo "Response: $BODY"
fi
echo ""

# 3. Test creating a blog without token
echo "3. Testing blog creation without token (should fail)..."
NO_TOKEN_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST "$BASE_URL/api/blogs" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Should Fail",
    "author": "Test",
    "url": "https://test.com"
  }')

HTTP_CODE=$(echo "$NO_TOKEN_RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
BODY=$(echo "$NO_TOKEN_RESPONSE" | sed '/HTTP_CODE/d')

if [ "$HTTP_CODE" = "401" ]; then
  echo "✓ Correctly rejected request without token"
  echo "Response: $BODY"
else
  echo "✗ Unexpected response. HTTP Code: $HTTP_CODE"
  echo "Response: $BODY"
fi
echo ""

# 4. Test getting all blogs
echo "4. Getting all blogs..."
GET_RESPONSE=$(curl -s "$BASE_URL/api/blogs")
BLOG_COUNT=$(echo "$GET_RESPONSE" | grep -o '"title"' | wc -l | tr -d ' ')
echo "✓ Found $BLOG_COUNT blogs"
echo ""

echo "=== Tests Complete ==="

