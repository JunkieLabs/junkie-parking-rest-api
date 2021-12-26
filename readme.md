# Serverless REST API build with Cloud Functions, Firestore, Express and TypeScript

This is a simple API that manage billing of vehicles in parking area. 

## Requirements

[NodeJS](https://nodejs.org/en/)

You will need a Firebase project and firebase tools cli

```
npm install -g firebase-tools
```

## Getting Started

You can follow the guide on [Medium](https://) or clone this repository.

## Clone this repository

```
git clone https://github.com/JunkieLabs/junkie-parking-rest-api.git .
```

## Create Firebase Project

## Updating firebase project id

You need to change the firebase project name in *.firebaserc* file.

```
{
  "projects": {
    "default": "your-project-id"
  }
}
```

After that, you can log in to firebase in the terminal 

```
firebase login
```

## Serve function

For the first time, you have deploy the hosting and functions together

```
npm run deploy
```

## Deploy to firebase

For the first time, you have deploy the hosting and functions together

```
npm run deploy
```

After that, you just need to deploy functions only

```
firebase deploy --only functions
```

<br>

# Contributors:

- [Bharath Kishore](https://github.com/bhrthkshr)
- [Niraj Prakash](https://github.com/nirajprakash)

<br>

# FAQ:

### Is this project related to Junkie Parking Android App?



>  Yes! The App won't run without backend. You can this repo and run on your system.


<br>

# Further help

This project is an open-source initiative by Junkie Labs.

For any questions or suggestions send a mail to junkielabs.dev@gmail.com or chat with the core-team on gitter.

[![Gitter](https://badges.gitter.im/JunkieLabs/junkie-parking.svg)](https://gitter.im/JunkieLabs/junkie-parking?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

<br>
<br>

# License

[MIT License](/LICENSE).


# TODO 

- change project Id
- change firestore ref