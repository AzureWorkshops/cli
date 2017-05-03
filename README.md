# azworkshops-cli
[![Build Status](https://travis-ci.org/AzureWorkshops/cli.svg?branch=master)](https://travis-ci.org/AzureWorkshops/cli)

## Description
This is the command-line interface (CLI) for the Azure Workshops.  The CLI assists by building environments required by the workshops so that no additional pre-configuration is required.

Refer to the workshop setup instructions to determine which base configuration to use.

Upon running the CLI, you will be required to authenticate against Azure, choose a subscription and a region.  Additionally, each base configuration may have additional configuration questions.

## Requirements
The Azure Workshops CLI requires Node.js.

## Installation
Typically, the best use case is to install the CLI globally so that it can be executed anywhere in your system.

```bash
npm i azworkshops-cli -g
```

## Using the CLI
Simply run it from any command line and respond to the prompts.

```bash
azworkshops
```
