import fs from 'fs-extra';
import path from 'path';
import ignore from 'ignore';
import { glob } from 'glob';
import simpleGit, { SimpleGit } from 'simple-git';

// Define the file details structure
interface FileDetails {
    filePath: string;
    fileExtension: string;
    content: string;
    numOfLines: number;
    numOfCharacters: number;
    diff: string;
}

// Utility function to get file details
async function getFileDetails(filePath: string, git: SimpleGit): Promise<FileDetails> {
    const content = await fs.readFile(filePath, 'utf8');
    const fileExtension = path.extname(filePath).substring(1); // remove the dot
    const numOfLines = content.split('\n').length;
    const numOfCharacters = content.length;

    let diff = '';
    try {
        // Get the diff of the file compared to the last commit
        const diffResult = await git.diff(['HEAD', '--', filePath]);
        diff = diffResult || 'No diff';
    } catch (error) {
        diff = 'Error computing diff';
    }

    return {
        filePath,
        fileExtension,
        content,
        numOfLines,
        numOfCharacters,
        diff
    };
}

// Function to generate file summary
async function generateFileSummary() {
    const projectRoot = path.resolve('.');
    const gitignorePath = path.join(projectRoot, '.gitignore');

    // Initialize git instance
    const git = simpleGit(projectRoot);

    // Read .gitignore file
    let gitignorePatterns: string[] = [];
    if (fs.existsSync(gitignorePath)) {
        const gitignoreContent = await fs.readFile(gitignorePath, 'utf8');
        gitignorePatterns = gitignoreContent.split('\n').filter((line: string) => line && !line.startsWith('#'));
    }

    // Initialize ignore instance with .gitignore patterns
    const ig = ignore().add(gitignorePatterns);

    // Glob pattern to include all files but exclude specific folders and files
    const pattern = '**/*';
    const options = {
        nodir: true,
        ignore: ['node_modules/**', '.git/**', 'package-lock.json', '.gitignore'],
        cwd: projectRoot
    };

    try {
        // Find all files matching the pattern
        const files = await glob(pattern, options);

        // Filter out files matching .gitignore patterns
        const filteredFiles = files.filter((file: string) => !ig.ignores(file));

        // Generate file details
        const fileDetailsPromises = filteredFiles.map((file: string) => getFileDetails(path.join(projectRoot, file), git));
        const fileDetails = await Promise.all(fileDetailsPromises);

        // Write file details to a JSON file
        const outputPath = path.join(projectRoot, 'fileSummary.json');
        await fs.writeJson(outputPath, fileDetails, { spaces: 2 });
        console.log(`File summary written to ${outputPath}`);
    } catch (error) {
        console.error('Error reading files:', error);
    }
}

// Execute the function
generateFileSummary();
