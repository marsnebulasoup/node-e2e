const
    Crypto = require('crypto'),
    NodeRSA = require('node-rsa');

class AES {
    constructor(algorithm = "aes-256-gcm") {
        this.alg = algorithm
    }
    hexToBuffer = (hex) => Buffer.from(hex, 'hex')
    aes_encrypt = (text) => {
        let pwd = Crypto.randomBytes(32), // Generate a random password
            iv = Crypto.randomBytes(32)     // Generate a random initalization vector

        // Encrypt the text
        const cipher = Crypto.createCipheriv(this.alg, pwd, iv);
        let encrypted = cipher.update(text, 'utf8', 'base64');
        encrypted += cipher.final('base64');

        // Sign the message
        let tag = cipher.getAuthTag();

        return {
            keys: {
                pwd: pwd.toString('hex'),
                iv: iv.toString('hex'),
            },
            encrypted: {
                content: encrypted,
                tag: tag.toString('hex')
            }
        };
    }
    aes_decrypt = (encrypted, pwd, iv) => {
        // Decrypt message
        let decrypter = Crypto.createDecipheriv(this.alg, this.hexToBuffer(pwd), this.hexToBuffer(iv))
        decrypter.setAuthTag(this.hexToBuffer(encrypted.tag));
        let deciphered = decrypter.update(encrypted.content, 'base64', 'utf8')
        deciphered += decrypter.final('utf8');
        return deciphered;
    }
}

class EncryptionFailed extends Error {
    constructor(msg) {
        super(msg);
        this.name = "EncryptionFailed";
    }
}

class AuthenticationFailed extends Error {
    constructor(msg) {
        super(msg);
        this.name = "AuthenticationFailed";
    }
}

class DecryptionFailed extends Error {
    constructor(msg) {
        super(msg);
        this.name = "DecryptionFailed";
    }
}

class NodeE2E {
    constructor(keys) {
        this.keys = keys
        this.pub = this.pri = new NodeRSA()
        this.pub.importKey(this.keys.public.key, this.keys.public.format)
        this.pri.importKey(this.keys.private.key, this.keys.private.format)
    }
    encrypt(msg) {
        try {
            const
                aes_encrypted = new AES().aes_encrypt(msg),
                signature = this.sign(aes_encrypted.keys),
                encrypted_keys = this.pub.encrypt({
                    signature: signature,
                    keys: aes_encrypted.keys
                }, 'base64')

            return {
                keys: encrypted_keys,
                msg: aes_encrypted.encrypted,
            }
        } catch (err) {
            throw new EncryptionFailed(err)
        }


    }
    decrypt(msg) {
        try {
            const decrypted_keys = this.pri.decrypt(msg.keys, 'json')

            if (this.verify(decrypted_keys)) {
                const decrypted_msg = new AES().aes_decrypt(msg.msg, decrypted_keys.keys.pwd, decrypted_keys.keys.iv)
                return decrypted_msg
            }

            else {
                throw new AuthenticationFailed("Unable to verify the integrity of the message; it might have been tampered with")
            }
        } catch (err) {
            throw new DecryptionFailed(err)
        }
    }
    sign(keys) {
        return this.pri.sign(keys, 'base64')
    }
    verify(keys) {
        return this.pub.verify(keys.keys, keys.signature, 'buffer', 'base64')
    }
}

module.exports = NodeE2E;