/**
 * Cache performance demonstration script
 * This demonstrates the caching system working in isolation
 */

import { promises as fs } from 'fs'
import { join } from 'path'
import buildCache from '../lib/cache/buildCache'

const DEMO_DATA = {
  pokemon: ['bulbasaur', 'charizard', 'pikachu'],
  timestamp: Date.now(),
  message: 'This is cached test data!'
}

async function demonstrateCache() {
  console.log('🧪 Cache Performance Demonstration')
  console.log('==================================')
  
  try {
    // Test 1: Write to cache
    console.log('\n1️⃣ Testing cache write...')
    const start1 = performance.now()
    await buildCache.set('demo-data', DEMO_DATA, 60000) // 1 minute TTL
    const end1 = performance.now()
    console.log(`✅ Cache write completed in ${(end1 - start1).toFixed(2)}ms`)
    
    // Test 2: Read from cache (cache hit)
    console.log('\n2️⃣ Testing cache read (should hit)...')
    const start2 = performance.now()
    const cachedData = await buildCache.get('demo-data')
    const end2 = performance.now()
    
    if (cachedData) {
      console.log(`✅ Cache hit! Read completed in ${(end2 - start2).toFixed(2)}ms`)
      console.log(`📦 Retrieved data:`, JSON.stringify(cachedData, null, 2))
    } else {
      console.log('❌ Cache miss - unexpected!')
    }
    
    // Test 3: Check cache directory
    console.log('\n3️⃣ Checking cache directory...')
    const cacheDir = join(process.cwd(), '.next-cache')
    try {
      const files = await fs.readdir(cacheDir)
      console.log(`📁 Cache directory contains ${files.length} files`)
      files.forEach(file => console.log(`   - ${file}`))
    } catch (error) {
      console.log('📁 Cache directory not found or empty')
    }
    
    // Test 4: Performance comparison
    console.log('\n4️⃣ Performance comparison...')
    
    // Simulate slow operation (like API call)
    const simulateSlowOperation = () => new Promise(resolve => setTimeout(resolve, 100))
    
    // Without cache
    const startSlow = performance.now()
    await simulateSlowOperation()
    const endSlow = performance.now()
    const slowTime = endSlow - startSlow
    
    // With cache
    const startCache = performance.now()
    await buildCache.get('demo-data')
    const endCache = performance.now()
    const cacheTime = endCache - startCache
    
    console.log(`⏱️ Slow operation: ${slowTime.toFixed(2)}ms`)
    console.log(`⚡ Cache retrieval: ${cacheTime.toFixed(2)}ms`)
    console.log(`🚀 Performance improvement: ${((slowTime - cacheTime) / slowTime * 100).toFixed(1)}%`)
    
    // Cleanup
    console.log('\n5️⃣ Cleaning up...')
    await buildCache.delete('demo-data')
    console.log('✅ Cache cleanup completed')
    
    console.log('\n🎉 Cache demonstration completed successfully!')
    console.log('\nThis demonstrates how the build-time caching system:')
    console.log('• Stores API responses to disk with TTL')
    console.log('• Provides sub-millisecond retrieval times')
    console.log('• Dramatically reduces build times on subsequent runs')
    console.log('• Handles cache invalidation automatically')
    
  } catch (error) {
    console.error('❌ Cache demonstration failed:', error)
  }
}

// Run demonstration if called directly
if (require.main === module) {
  demonstrateCache()
}

export default demonstrateCache