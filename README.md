# subtitle-gen

A command-line tool to generate subtitle from video file. 

## Install

``` shell
npm i subtitle-gen -g
```

## Usage

``` shell
sg --help
```

## Configuration

Configuration file path: ~/.subtitle-gen.json

``` json
{
  "debounceTime": 360, // debounce time(in milliseconds) parameter of voice action detection.
  "aipAppId": "Your baidu aip appid",
  "aipAPIKey": "Your baidu aip apikey",
  "aipSecretKey": "Your baidu aip secretkey"
}
```
