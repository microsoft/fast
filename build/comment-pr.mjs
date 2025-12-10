#!/usr/bin/env node

/**
 * Generic GitHub PR Comment Utility
 *
 * This utility provides functions to create or update comments on GitHub PRs.
 * Can be used by other scripts to manage PR comments.
 */

import { readFileSync } from 'fs';
import { Octokit } from '@octokit/rest';

/**
 * Posts or updates a comment on a GitHub PR
 * @param {Object} options - Comment options
 * @param {string} options.content - The comment content (markdown)
 * @param {string} options.identifier - Unique identifier to find existing comments
 * @param {string} options.token - GitHub token
 * @param {string} options.repo - Repository in format "owner/name"
 * @param {number} options.prNumber - Pull request number
 * @returns {Promise<Object>} Comment result with id and action ('created' or 'updated')
 */
export async function commentOnPR({ content, identifier, token, repo, prNumber }) {
  const [owner, repoName] = repo.split('/');

  if (!owner || !repoName) {
    throw new Error('Invalid repository format. Expected: owner/repo');
  }

  const octokit = new Octokit({ auth: token });

  // Find existing comment with the identifier
  const { data: comments } = await octokit.rest.issues.listComments({
    owner: owner,
    repo: repoName,
    issue_number: prNumber,
  });

  const existingComment = comments.find(comment =>
    comment.user?.type === 'Bot' &&
    comment.body.includes(identifier)
  );

  if (existingComment) {
    // Update existing comment
    await octokit.rest.issues.updateComment({
      owner: owner,
      repo: repoName,
      comment_id: existingComment.id,
      body: content
    });
    return { id: existingComment.id, action: 'updated' };
  } else {
    // Create new comment
    const { data: newComment } = await octokit.rest.issues.createComment({
      owner: owner,
      repo: repoName,
      issue_number: prNumber,
      body: content
    });
    return { id: newComment.id, action: 'created' };
  }
}

// CLI interface when run directly
async function main() {
  const args = process.argv.slice(2);
  const reportFile = args.find(arg => arg.startsWith('--report-file='))?.split('=')[1];
  const identifier = args.find(arg => arg.startsWith('--identifier='))?.split('=')[1];
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPOSITORY;
  const prNumber = process.env.PR_NUMBER;

  if (!reportFile) {
    console.error('❌ --report-file argument is required');
    process.exit(1);
  }

  if (!identifier) {
    console.error('❌ --identifier argument is required');
    process.exit(1);
  }

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
    console.log('💬 Managing PR comment...');
    console.log(`Repository: ${repo}`);
    console.log(`PR Number: ${prNumber}`);
    console.log(`Report file: ${reportFile}`);
    console.log(`Identifier: ${identifier}`);

    const content = readFileSync(reportFile, 'utf8');

    const result = await commentOnPR({
      content,
      identifier,
      token,
      repo,
      prNumber: parseInt(prNumber)
    });

    console.log(`✅ Comment ${result.action} successfully (ID: ${result.id})`);

  } catch (error) {
    console.error('❌ Error managing PR comment:', error);

    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }

    process.exit(1);
  }
}

// Run main if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
}
