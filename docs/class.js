// ================================================== [50]
//     Definition

'use strict'

class QR_Code {
    constructor(VER, ECL, MP) {
        const LEN = 17 + 4*VER
        this.LEN = LEN
        this.VER = VER
        this.ECL = ECL
        this.MP  = MP
        this.matrix = []

        for (let y = 0; y < LEN; y++) {
            this.matrix.push([])
            for (let x = 0; x < LEN; x++) this.matrix[y].push(-1)
        }
        function Function_Pattern(qr) {
            qr.Position_Detection()
            qr.Timing()
            qr.Alignment()
        }
        Function_Pattern(this)
        this.Format_Information()
        if (7 <= VER) this.Version_Information()

        // https://www.swetake.com/qrcode/qr10.html
        // マスクは仕様書53ページ
        this.Data_and_ErrorCorrection()
        this.Masking()

        Function_Pattern(this)
        this.Format_Information()
        if (7 <= VER) this.Version_Information()
    }

    square(x, y, dxy, fill) {
        for (let dy = 0; dy < dxy; dy++)
        for (let dx = 0; dx < dxy; dx++) this.matrix[y + dy][x + dx] = fill
    }

    Position_Detection() {
        const LEN = this.LEN
        this.square(    0, 0, 8, 0)
        this.square(LEN-8, 0, 8, 0)
        this.square(0, LEN-8, 8, 0)
        function rings(qr, x, y) {
            qr.square(x+0, y+0, 7, 1)
            qr.square(x+1, y+1, 5, 0)
            qr.square(x+2, y+2, 3, 1)
        }
        rings(this, 0, 0)
        rings(this, LEN-7, 0)
        rings(this, 0, LEN-7)
    }

    Timing() {
        for (let i = 8; i < this.LEN-8; i++) this.matrix[6][i] = this.matrix[i][6] = (i + 1) % 2
    }

    Alignment() {
        const LEN = this.LEN
        const VER = this.VER
        const spacingArray = [
            16,18,20,22,24,26,28,20,22,24,24,26,28,28,22,24,24,
            26,26,28,28,24,24,26,26,26,28,28,24,26,26,26,28,28
        ]
        function rings(qr, cx, cy) {
            qr.square(cx-2, cy-2, 5, 1)
            qr.square(cx-1, cy-1, 3, 0)
            qr.square(cx-0, cy-0, 1, 1)
        }
        let E = 0
        if (VER === 1) return // 1 + VER/7
        if ( 2 <= VER && VER <=  6) E = 1
        if ( 7 <= VER && VER <= 13) E = 2
        if (14 <= VER && VER <= 20) E = 3
        if (21 <= VER && VER <= 27) E = 4
        if (28 <= VER && VER <= 34) E = 5
        if (35 <= VER && VER <= 40) E = 6
        const spacing = spacingArray[VER - 7]
        for (let i = 0, cy = LEN - 7; i < E; i++, cy -= spacing)
        for (let j = 0, cx = LEN - 7; j < E; j++, cx -= spacing)
            rings(this, cx, cy)
        for (let i = 1, c = LEN - 7 - spacing; i < E; i++, c -= spacing) {
            rings(this, 6, c)
            rings(this, c, 6)
        }
    }

    Format_Information() {
        const LEN = this.LEN
        let ECL = 0
        switch (this.ECL) {
            case 'L': ECL = 1; break
            case 'M': ECL = 0; break
            case 'Q': ECL = 3; break
            case 'H': ECL = 2; break
        }
        const C = (ECL << 13) + (this.MP << 10)
        const R = modulo(C, 1335) // Remainder
        let Format = (C + R)^21522
        function nextBit() {
            const bit = Format % 2
            Format >>= 1
            return bit
        }
        for (let i = 0; i < 6; i++) this.matrix[i][8] = this.matrix[8][LEN-1-i] = nextBit()
        this.matrix[7][8] = this.matrix[8][LEN-7] = nextBit()
        this.matrix[8][8] = this.matrix[8][LEN-8] = nextBit()
        this.matrix[8][7] = this.matrix[LEN-7][8] = nextBit()
        this.matrix[LEN-8][8] = 1
        for (let i = 5; 0 <= i; i--) this.matrix[8][i] = this.matrix[LEN-1-i][8] = nextBit()
    }

    Version_Information() {
        const LEN = this.LEN
        const V   = this.VER << 12
        let Version = V + modulo(V, 7973)
        for (let i = 0; i < 6; i++)
        for (let j = 0; j < 3; j++) {
            this.matrix[i][LEN-11+j] = this.matrix[LEN-11+j][i] = Version % 2
            Version >>= 1
        }
    }

    Masking() {
        for (let y = 0; y < this.LEN; y++)
        for (let x = 0; x < this.LEN; x++) {
            let c = true
            switch (this.MP) {
                case 0: c = (x+y) % 2 == 0; break
                case 1: c =   y   % 2 == 0; break
                case 2: c =   x   % 3 == 0; break
                case 3: c = (x+y) % 3 == 0; break
                case 4: c = (parseInt(x/3)+parseInt(y/2)) % 2 == 0; break
                case 5: c = (  x * y  % 3 +  x * y  % 2 )     == 0; break
                case 6: c = (  x * y  % 3 +  x * y  % 2 ) % 2 == 0; break
                case 7: c = (  x * y  % 3 + (x + y) % 2 ) % 2 == 0; break
            }
            if (c) this.matrix[y][x] ^= 1
        }
    }

    Data_and_ErrorCorrection() {
        const LEN = this.LEN

        // ===================================================================
        let str = 'Sorry. This program is under construction.'
        let strLEN = str.length
        let data_array = []
        let MODE = 4
        let cns = 0 // Character Nnumber Specifier
        let bits = []
        for (let i = 0; i < 4; i++) bits.push((MODE >> 3-i) % 2)

        switch (MODE) {
            case 1: // Number
                data_array = []
                strLEN = 144
                for (let i = 0; i < 16; i++) {
                    data_array.push(123)
                    data_array.push(456)
                    data_array.push(789)
                }
                
                // Character Nnumber Specifier
                if      (this.VER <=  9) cns = 10
                else if (this.VER <= 26) cns = 12
                else cns = 14
                for (let i = 0; i < cns; i++) bits.push((strLEN >> (cns-1-i)) % 2)

                for (const code of data_array)
                for (let i = 0; i < 10; i++)
                    bits.push((code >> 9-i) % 2)
                break
            case 2: // Character Mode
                data_array = []
                str = "SORRY. THIS PROGRAM IS UNDER CONSTRUCTION."
                strLEN = str.length

                for (let i = 0, j = 0; i < str.length; i++, j++) {
                    const code = Character_Code.indexOf(str.charAt(i))
                    if (code === -1) console.log('Unexpected letter:', str.charAt(i))
                    
                    if (i === strLEN - 1 && j % 2 === 0) data_array.push(code) // Last letter
                    else if (j % 2 === 0) data_array.push(45*code) // First letter of two
                    else data_array[parseInt(j/2)] += code         // Second letter
                }

                // Character Nnumber Specifier
                if      (this.VER <=  9) cns =  9
                else if (this.VER <= 26) cns = 11
                else cns = 13
                for (let i = 0; i < cns; i++) bits.push((strLEN >> (cns-1-i)) % 2)

                for (const code of data_array)
                for (let i = 0; i < 11; i++)
                    bits.push((code >> 10-i) % 2)
                if (strLEN % 2 === 1) {
                    const l = bits.length
                    for (let i = 0; i < 6; i++) bits[l-6+i - 5] = bits[l-6+i]
                    for (let i = 0; i < 5; i++) bits.pop()
                }
                break
            case 4: // Byte Mode
                data_array = []
                for (const character of str) {
                    const code = Byte_Code.indexOf(character)
                    if (code === -1) console.log('Unexpected letter:', character)
                    data_array.push(code)
                }

                // Character Number Specifier
                cns = this.VER <= 9 ? 8 : 16
                for (let i = 0; i < cns; i++) bits.push((strLEN >> (cns-1-i)) % 2)

                for (const code of data_array)
                for (let i = 0; i < 8; i++)
                    bits.push((code >> 7-i) % 2)
                break
            case 8: break // Kanji
            case 3: break // 連結
            case 7: break // ECI
        }
        
        for (let i = 0; i < 4; i++) bits.push(0) // 終端パターン
        while (bits.length % 8 !== 0) bits.push(0)
        
        // bit Array -> 8 bit Word Array
        const data = []
        for (let i = 0; 0 < bits.length; i++) {
            data.push(bits.shift())
            for (let j = 1; j < 8; j++) data[i] = (data[i] << 1) + bits.shift()
        }
        // console.log(data)
        const block_info = Block_List[this.VER][this.ECL]
        let all_data_word = 0
        for (const bi of block_info) all_data_word += bi.block * bi.data_word
        for (let i = 0; data.length < all_data_word; i++) data.push([236, 17][i % 2]) // 埋め草コード
        
        // Divide into Block (Data Block)
        const data_words = [] // 2 dimensional
        for (const aa of block_info)
        for (let i = 0; i < aa.block; i++) {
            data_words.push([])
            for (let j = 0; j < aa.data_word; j++) data_words[data_words.length-1].push(data.shift())
        }
        // Divide into Block (EC Block) 必要な次数の生成多項式を用いて、関数の剰余を計算
        const ec_words = [] // 2 dimensional
        for (const db of data_words) ec_words.push(db.slice())
        const EC_LEN = block_info[0].ec_word
        let gp
        for (const g of Generator_Polynomial)
            if (g.length === EC_LEN) gp = g.slice().reverse()
        for (let i = 0; i < ec_words.length; i++) {
            for (let j = 0; j < gp.length; j++) ec_words[i].push(0)
            ec_words[i] = GaloisMod(ec_words[i], gp)
        }

        // データ埋め込み (Data)
        const data_ec_words = []
        for (let i = 0; i < block_info[0].data_word; i++)
        for (const array of data_words)
            data_ec_words.push(array.shift())
        for (const array of data_words)
            if (array.length !== 0) data_ec_words.push(array[0])
        // データ埋め込み (EC)
        for (let i = 0; i < EC_LEN; i++)
        for (const array of ec_words)
            data_ec_words.push(array.shift())
        data_ec_words.push(255)
        
        // Fill Module
        let flag_y = 0
        let c_i = 0 // code index
        let b_i = 0 // bit index
        filling:
        for (let X = LEN-1; 0 <= X; X -= 2) {
            if (flag_y % 2 === 0) {
                for (let Y = LEN-1; 0 <= Y; Y--)
                for (let x = 0; x < 2; x++)
                    if (this.matrix[Y][X-x] === -1) {
                        this.matrix[Y][X-x] = (data_ec_words[c_i] >> (7-b_i)) % 2
                        b_i++
                        if (b_i >= 8) {
                            c_i++
                            if (data_ec_words.length <= c_i) break filling
                            b_i = 0
                        }
                    }
            } else {
                for (let Y = 0; Y < LEN; Y++)
                for (let x = 0; x < 2; x++)
                    if (this.matrix[Y][X-x] === -1) {
                        this.matrix[Y][X-x] = (data_ec_words[c_i] >> (7-b_i)) % 2
                        b_i++
                        if (b_i >= 8) {
                            c_i++
                            if (data_ec_words.length <= c_i) break filling
                            b_i = 0
                        }
                    }
            }
            if (X === 8) X = 7
            flag_y++
        }
    }
}

// ================================================== [50]
//     END
// ================================================== [50]