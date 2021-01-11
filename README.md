# node-e2e

Encrypt data with RSA and AES-256 encryption.

## How it works

**Encryption**

1. Public/private keys are generated, however you like, and passed on to `node-e2e`.
2. `node-e2e` encrypts the message with AES-256 encryption, using a random password and initialization vector (IV) each time.
3. The password and IV are signed and encrypted with RSA encryption.
4. The RSA encrypted keys and AES encrypted message are returned in JSON format.

**Decryption**

1. The AES keys are decrypted and verified with RSA.
2. If the keys are authenticated, the AES-encrypted message is decrypted with these keys and returned.

## Installation

```
npm i node-e2e
```



## Usage

```javascript
import NodeE2E from 'node-e2e'

const e2e = new NodeE2E(KEYS) // <-- see below for instructions on how to format your keys

let msg = "Hello World";

let encrypted = e2e.encrypt(msg);
let decrypted = e2e.decrypt(encrypted)
console.log(decrypted)

```

**Formatting your keys**

`NodeE2E` accepts one parameter: `keys`. It must be an object, with two properties, `public`, and `private`. Both `public` and `private` must be objects with two properties, `format` (the format of the key), and `key`, the key itself. Here's an example:

```javascript
const KEYS = {
    private: {
        format: 'pkcs8-private-pem',
        key: `-----BEGIN PRIVATE KEY-----
        MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCYHvOQhU9jIKv2
        2q3zKVZbrHjSKt8R9tJ4XIJa8gUSNDRuk7gPg8J8/KfS1gm9ZVsYPwi+TbdvbXjY
        IEX16E7PQDaFDP2vl6LMmHvaSzJjnP8jeOQDtkQjgdIOeG2A2NSlcVRb1dIp5BSC
        h60H6Llou2AGnUO67/9sTN3ypUJ+TQDcwCKMh/n7o3xW/h8Jnma57tfVOpRsMm0m
        3ODcSu9YKNHbGIE5nK3aJ/T/tGlwwqIldcf8V5nwZ6Wy2Ddvj5aS7mqE0T1qSbAT
        fbZqlcm4xThzr4gaVgyR6EgOsro7qdON0D7qfNJ8dGi7rgq5E/Pw2NWZ5bFgf97j
        lD7wAugNAgMBAAECggEAadGWEuF5QPaYSScDvFP0G99VSLXD6QYukMWhdExJFMm1
        83nUnw5D+5fx0mtL6TEZdjtbBK6hPOUFHCsPH6mTMP51LobD7iLof7RO66JFkh/D
        J9TPoHlo2t5S1fgWDHxJKDE2wo9yG+vqDIb+6bKNT3qQqOk7FU4f+yFZf5JQN/Sc
        UfQhlifDw9PeysWkUPtGicwiP0Y5/Iws2Dk8tvTTUQ4D6LiBRf5nn2WdFNGzqmAs
        NEOJBVg44sUqnNL1KC+n+sSHxnwDgFbB5XGzt2SnmbmK87DHMRMpCLU7KaBY0haB
        ya3OecSID1IG5ykk+nOMn4BFmNNX1rn2ayXJbtJOLQKBgQDKayIMumw6ekmNpKsx
        NuDGaTpqY6tcQ6dLtMOZaX15qUKKtk5iTi7ztWZ9AyeWzAb2H7TIPq9h6Qkk2WxN
        JjPFY0nWJdymPDntw+uhz/XH3osKSdRW1iaiuv5+VliycOdNuidcghr0hzaV9YRz
        u8jJcQBaNS6Ycc8dINed6iITewKBgQDAY2h1+iCWx3YkAWctduuQFKwpUi2Q9489
        KTjFQppHja7AzXfISFko/KNYVfQ0fcCA6SI7xSE8Hei2dxCWKs5ukmXbtXBxk8nb
        elWF8cpnSWZi8PT9fkexmtxbT6ZegJ+m4jBiBRXXWuhbGQubw8iQF74VYMpX3Rk6
        +r/K9fz4FwKBgG3POrSO+aGrr3VQzLIxJDVe5prKoS63YO14DdiO2swCX5/ikJlR
        8rSxRv0wlex/mJMy1h7/qqNCCXzdGpyrydAeMfMjrRTdfUuYSp8IszwPZXxaWwAU
        wvbq3J7q9sku6LxI7YuI5VicdadaftVOHPny/I7zZOi8bPBPXclEN+I7AoGADQKr
        /c58hbXXd3fg0mJIa+X5/pFgI32aYjh3bl+ir1QVjVRX1WOPJAZxxXeKnEIk0pLx
        jbk3FimvoydKJ92dOD0ORl1uzT+BVyZewkAnv/RmyCojZ0Ey9//RBxvL1Hg+U7rY
        KsjNQVMUg5SeBFqpJZV1dVymUmrRWfu7HK6l/OECgYA6NlwqlkkpH5I01kRdR3n6
        2KJ9GznaCNUYCF//uHxUx6VrDwBkMzWXfSW6dY1ZA9QbodrmVH8U6hfZ7QYYv5qq
        8DAO7AK2maeaGPjZ/WZg6qQh/B+HeBYxdFe+mvdO7WF9fYBO/GqEEy2CpgJn77wj
        aBVLjJ1m+Tk0o1mj/f0CsQ==
        -----END PRIVATE KEY-----`
    },
    public: {
        format: 'pkcs8-public-pem',
        key: `-----BEGIN PUBLIC KEY-----
        MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAmB7zkIVPYyCr9tqt8ylW
        W6x40irfEfbSeFyCWvIFEjQ0bpO4D4PCfPyn0tYJvWVbGD8Ivk23b2142CBF9ehO
        z0A2hQz9r5eizJh72ksyY5z/I3jkA7ZEI4HSDnhtgNjUpXFUW9XSKeQUgoetB+i5
        aLtgBp1Duu//bEzd8qVCfk0A3MAijIf5+6N8Vv4fCZ5mue7X1TqUbDJtJtzg3Erv
        WCjR2xiBOZyt2if0/7RpcMKiJXXH/FeZ8Gelstg3b4+Wku5qhNE9akmwE322apXJ
        uMU4c6+IGlYMkehIDrK6O6nTjdA+6nzSfHRou64KuRPz8NjVmeWxYH/e45Q+8ALo
        DQIDAQAB
        -----END PUBLIC KEY-----`
    }
}
```

See [`Node-RSA`'s docs](https://github.com/rzcoder/node-rsa#format-string-syntax) to find out how to format your keys. Note that you should only use PEM (base64) formatted keys.



## Generating Keys

You can generate keys however you like, but here's an example generating keys with `Node-RSA` (a dependency)

```javascript
// TO GENERATE KEYS (takes a bit of time):
const key = new NodeRSA();
key.generateKeyPair();
let pubkey = key.exportKey('pkcs8-public-pem')
console.log(pubkey)
let prikey = key.exportKey('pkcs8-private-pem')
console.log(prikey)
```

See the [docs](https://github.com/rzcoder/node-rsa#generate-new-512bit-length-key) for more info.

## Changelog

**v1.0.0:** Initial commit.

















