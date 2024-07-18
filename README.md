# kdk-cf

`kdk-cf` is a TypeScript project designed to interact with Cloudflare's API. It provides functionalities to manage DNS records, Page Rules, and Redirect Rules for various domains.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [License](#license)

## Installation

To get started with the project, clone the repository and install the dependencies:

```bash
git clone https://github.com/kodiakllc/kdk-cf.git
cd kdk-cf
npm install
```

Ensure you have the required global packages installed:

```bash
npm install -g ts-node typescript
```

## Usage

### Generating File Summary

You can generate a summary of all files in the project by running the `generateFileSummary` script. This will create a `fileSummary.json` file in the project root containing details of all files except those specified in `.gitignore`.

```bash
npm run generate
```

### Running the Main Script

To execute the main functionality of the project, run the `main.ts` script:

```bash
npm run dev
```

This script interacts with the Cloudflare API to list zones, DNS records, page rules, and redirect rules. It also allows updating redirect rules.

## Project Structure

The project follows a structured layout:

```
kdk-cf/
├── scripts/
│   └── init.sh                 # Initialization script
├── src/
│   ├── services/
│   │   └── cloudflare-service.ts # Cloudflare service API interactions
│   ├── types/
│   │   ├── DnsRecord.ts         # Type definition for DNS records
│   │   ├── PageRule.ts          # Type definition for Page Rules
│   │   ├── RedirectRule.ts      # Type definition for Redirect Rules
│   │   └── Zone.ts              # Type definition for Zones
│   ├── index.ts                 # Entry point script
│   └── main.ts                  # Main script with primary functionality
├── generateFileSummary.ts       # Script to generate file summary
└── package.json                 # Project configuration and dependencies
```

## Scripts

The following scripts are available in the project:

- `generate`: Run the file summary generation script.
- `dev`: Run the development script.

```json
"scripts": {
  "generate": "ts-node src/generateFileSummary.ts",
  "dev": "ts-node src/index.ts"
}
```

## Contributing

We welcome contributions to this project. Please follow the steps below to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Commit your changes (`git commit -am 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature-name`).
5. Create a new Pull Request.

## License

This project is licensed under the GNU General Public License Version 3. See the [LICENSE](LICENSE) file for details.

