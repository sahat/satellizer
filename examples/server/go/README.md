# Go Server Example

# Installation

You need to clone satellizer's repo by running:
```shell
$ git clone https://github.com/sahat/satellizer
```

Next, cd into the go server example:
```shell
$ cd examples/server/go
```

Then you need to generate rsa keys to be able to use JWT:
```shell
$ ./gen-keys.sh
```

Get dependencies
```shell
$ go get ./...
```

# Usage

You need an instance of MongoDB running on your local machine. By default, its address is "localhost".

If you are inside $GOPATH:
```shell
$ go run main.go
```

If you are outside of $GOPATH (git clone somewhere):
```shell
$ go build && ./go
```

Access satellizer's interface, at [localhost:3000](http://localhost:3000)