# SteemVoter-Lotto by @netuoso

## About
SteemVoter-Lotto is a NodeJS application that will allow you to automatically vote on posts that are sent to the bot with a link attached to the memo field. This bot also contains the ability to run a drawing of all of the users that have bought an upvote or a lottery entry.

### How To Install
- Clone the repository
  - `git clone https://github.com/netuoso/steemvoter-lotto`
- Change into the project directory
  - `cd steemvoter-lotto`
- Install Homebrew (if not already installed)
  - `ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`
- Install NodeJS and NPM
  - `brew install node`
- Install Node Packages
  - `npm install`

### How To Run
- Configure the bot
  - `config.js`
    - add your bot username
    - add your bot posting key
    - add your bot active key
- Run the bot in normal mode
  - `npm run start`
- Run the bot in lottery mode (exits after drawing)
  - `npm run lottery`
