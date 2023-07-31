import * as core from '@actions/core';
import * as github from '@actions/github';

async function run() {
    try {
        // Get input parameters
        const token = core.getInput('github-token');

        // Get octokit
        const octokit = github.getOctokit(token);

        // Get user repositories
        const repos = await octokit.rest.repos.listForAuthenticatedUser();

        // Initialize language count
        const languageCount: { [key: string]: number } = {};

        // For each repo, get the languages used and increment the count
        for (const repo of repos.data) {
            const languages = await octokit.rest.repos.listLanguages({
                owner: repo.owner.login,
                repo: repo.name,
            });

            for (const language in languages.data) {
                if (language in languageCount) {
                    languageCount[language] += 1;
                } else {
                    languageCount[language] = 1;
                }
            }
        }
        console.log(languageCount);

    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
