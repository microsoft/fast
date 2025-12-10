#!/usr/bin/env node

/**
 * Bundle Size PR Comment Script
 *
 * This script posts bundle size reports as comments on GitHub PRs.
 * Uses the generic PR comment utility with bundle size specific configuration.
 */

import { commentOnPR } from './comment-pr.mjs';
import { readFileSync } from 'fs';

async function main() {
  // Parse command line arguments
  const args = process.argv.slice(2);
  const reportFile = args.find(arg => arg.startsWith('--report-file='))?.split('=')[1] || 'bundle-report.md';
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPOSITORY;
  const prNumber = process.env.PR_NUMBER;

  // Validate required environment variables
  if (!token) {
    console.error('❌ GITHUB_TOKEN environment variable is required');
    process.exit(1);
  }

  if (!repo) {
    console.error('❌ GITHUB_REPOSITORY environment variable is required');
    process.exit(1);
  }

  if (!prNumber) {
    console.error('❌ PR_NUMBER environment variable is required');
    process.exit(1);
  }

  try {
    console.log('📦 Posting bundle size report to PR...');
    console.log(`Repository: ${repo}`);
    console.log(`PR Number: ${prNumber}`);
    console.log(`Report file: ${reportFile}`);

    // Read the report content
    const content = readFileSync(reportFile, 'utf8');

    // Post comment using the utility with bundle size identifier
    const result = await commentOnPR({
      content,
      identifier: 'Bundle Size Report',
      token,
      repo,
      prNumber: parseInt(prNumber)
    });

    console.log(`✅ Bundle size comment ${result.action} successfully (ID: ${result.id})`);

  } catch (error) {
    console.error('❌ Error posting bundle size comment:', error);

    // Log additional details for debugging
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }

    process.exit(1);
  }
}

// Run the main function
main().catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
