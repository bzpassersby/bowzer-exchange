<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<a name="readme-top"></a>

<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/bzpassersby/bowzer-exchange">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Bowzer Exchange</h3>

  <p align="center">
    This is a web token exchange platform that enables token withdraw/deposit, placing exchange order,fulfill exchange orders,
    as well as viewing order historty and real time price charts. The token and exchange contracts were deployed to Goerli testnet
    and mumbai testnet. Currently supported tokens are Boz(ERC20), mock ETH and mock Dai. 
    <br />
    <a href="https://calm-pond-2622.on.fleek.co/" target="_blank">View Demo</a>
    ·
    <a href="https://github.com/bzpassersby/bowzer-exchange/issues">Report Bug</a>
    ·
    <a href="https://github.com/bzpassersby/bowzer-exchange/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>

  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

[![Product Name Screen Shot][product-screenshot]](https://calm-pond-2622.on.fleek.co/)

### Built With

- Solidity
- Hardhat
- Javascript
- React Js

<!-- GETTING STARTED -->

## Getting Started

The smart contracts were set to deploy through a json rpc node provider in hardhat framework. An ethereum account private key and a valid json-rpc-provider url is needed for deployment.

### Installation

1. npm

   ```sh
   npm install
   ```

2. Smart Contract Deployment

   - Before contract deployment, create ".env" file to include an enthereum account private key for deployment.

   - Reconfig "hardhat.config.js" `networks:{}` to update json rpc node
     provider url.

   - Run "./scripts/1_deploy.js" to deploy smart contract and specify deployment network.

3. Feed deployed contract address to the front end component

   The front end component is in the "./src" folder and takes in deployed smart contract address from "./src/config.json",
   in order to interact with the token and exchange contracts.

   - Update `config.json` in the "./src" folder to include deployed contract address under the key of the deployed chain Id.

4. Build and Serve

   ```sh
   npm run build
   npm run start
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

After initial contract deployments, run "./scripts/2_seed-exchange.js" to seed
initial exchange. This script does a test run to mint mock ERC20 tokens to specified user accounts, deposit mock tokens to the deployed Exchange.sol contract, and make initial trades, which creates initial trading data that will populate the front end web dapp later.

- Before running `./scripts/2_seed-exchange.js`, make sure to have at least two private keys in your `.env` file. This is to ensure the script can pull at least two ethereum accounts to create and fulfil trading orders.

- After running `./scripts/2_seed-exchange.js`, run the front end component by `npm run start`. Connect metamask wallet and switch to supported chain. The localhost web app should show the trading data just created by the script.

- To further interact with the front end web app, make sure to import your ethereum accounts used to run deployment and seed-exchange scripts
  into metamask, and connect to your account. This is to make sure you have the mock tokens previously minted in your account. And now you can deposit or make/fufill orders between your accounts on the web app. And the trading info would update on the order book and price chard

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

bzpassersby - [@bzpassersby](https://twitter.com/bzpassersby) - bowenzby@gmail.com

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/github_username/repo_name.svg?style=for-the-badge
[contributors-url]: https://github.com/github_username/repo_name/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/github_username/repo_name.svg?style=for-the-badge
[forks-url]: https://github.com/github_username/repo_name/network/members
[stars-shield]: https://img.shields.io/github/stars/github_username/repo_name.svg?style=for-the-badge
[stars-url]: https://github.com/github_username/repo_name/stargazers
[issues-shield]: https://img.shields.io/github/issues/github_username/repo_name.svg?style=for-the-badge
[issues-url]: https://github.com/github_username/repo_name/issues
[license-shield]: https://img.shields.io/github/license/github_username/repo_name.svg?style=for-the-badge
[license-url]: https://github.com/github_username/repo_name/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/linkedin_username
[product-screenshot]: images/screenshot.png
[next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[next-url]: https://nextjs.org/
[react.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[react-url]: https://reactjs.org/
[vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[vue-url]: https://vuejs.org/
[angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[angular-url]: https://angular.io/
[svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[svelte-url]: https://svelte.dev/
[laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[laravel-url]: https://laravel.com
[bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[bootstrap-url]: https://getbootstrap.com
[jquery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[jquery-url]: https://jquery.com
