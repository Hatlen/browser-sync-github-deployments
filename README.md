# Browser-sync-github-deployments

This app lists all your deployments (connected to github) and provides you
with the option to click an item in the list to start browser-sync with that
apps url set as the proxy argument (`browser-sync --proxy <server url>`).

## Usage / Setup

- You would want to run this app on a computer on your own WIFI network to be able
  to access the browser-sync ip address.
- Make sure you have node 11 and yarn installed
- Create a github personal access token and set the GITHUB_PERSONAL_ACCESS_TOKEN
  environment variable to that.
- Set the GITHUB_REPOSITORIES environment variable to a comma separated string
  with all the repositories you want to list the deployments for, e.g.
  "facebook/react,facebook/facebook".
- yarn install
- yarn start
- Access localhost:3000 to see the list of apps

## Troubleshooting

Set the DEBUG environment variable to \* or "log,error" when running yarn start
to be able to see error logs.
