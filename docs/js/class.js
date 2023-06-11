// ================ Class Definition ================ //

'use strict'

class QR_Code {
    constructor(VER, ECL, MP, MODE, text, cell_size) {
        this.error_message == ''
        this.VER = parseInt(VER)
        this.ECL = ECL
        this.MP  = parseInt(MP)
        this.MODE= MODE
        this.LEN = 4*this.VER + 17
        this.text = text
        this.cell_size = cell_size === undefined ? 10 : cell_size
        this.matrix = []

        for (let y = 0; y < this.LEN; y++) {
            this.matrix.push([])
            for (let x = 0; x < this.LEN; x++)
                this.matrix[y].push(-1)
        }
        function Function_Pattern(qr) {
            qr.Position_Detection()
            qr.Timing()
            qr.Alignment()
        }

        Function_Pattern(this)
        this.Format_Information()
        if (7 <= this.VER)
            this.Version_Information()

        this.Data_and_ErrorCorrection()
        this.Masking()

        Function_Pattern(this)
        this.Format_Information()
        if (7 <= this.VER)
            this.Version_Information()
    }

    square(x, y, dxy, bit) {
        for (let dy = 0; dy < dxy; dy++)
        for (let dx = 0; dx < dxy; dx++)
            this.matrix[y + dy][x + dx] = bit
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
        for (let i = 8; i < this.LEN-8; i++)
            this.matrix[6][i] =
            this.matrix[i][6] = (i + 1) % 2
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
        for (let i = 0; i < 6; i++)
            this.matrix[i][8] = this.matrix[8][LEN-1-i] = nextBit()
        this.matrix[7][8] = this.matrix[8][LEN-7] = nextBit()
        this.matrix[8][8] = this.matrix[8][LEN-8] = nextBit()
        this.matrix[8][7] = this.matrix[LEN-7][8] = nextBit()
        this.matrix[LEN-8][8] = 1
        for (let i = 5; 0 <= i; i--)
            this.matrix[8][i] = this.matrix[LEN-1-i][8] = nextBit()
    }

    Version_Information() {
        const LEN = this.LEN
        const V   = this.VER << 12
        let Version = V + modulo(V, 7973)
        for (let i = 0; i < 6; i++)
        for (let j = 0; j < 3; j++) {
            this.matrix[i][LEN-11+j] =
            this.matrix[LEN-11+j][i] = Version % 2
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
        const MODE = {
            'Number' : 1,
            'ABC123' : 2,
            'Connect': 3,// 連結モード
            'Byte'   : 4,
            'ECI'    : 7,
            'Kanji'  : 8
        }[this.MODE]
        let str = this.text
        let strLEN = str.length
        let ccs = 0 // Character Count Specifier
        let data_array = []
        let bits = []

        // Mode
        for (let i = 0; i < 4; i++)
            bits.push((MODE >> 3-i) % 2)

        if (MODE === 1) {// Number Mode
            // 01234567 -> 012 345 67
            while (0 < str.length) {
                data_array.push(parseInt(str.slice(0, 3)))
                str = str.slice(3)
            }

            // String Length -> bits
            if      (this.VER <=  9) ccs = 10
            else if (this.VER <= 26) ccs = 12
            else if (this.VER <= 40) ccs = 14
            for (let i = 0; i < ccs; i++)
                bits.push((strLEN >> (ccs-1-i)) % 2)

            // Data Array -> bits
            const last = data_array.pop()
            for (const code of data_array)
            for (let i = 0; i < 10; i++)
                bits.push((code >> 9-i) % 2)
            let tmp = 0
            if      (last <  10) tmp =  4
            else if (last < 100) tmp =  7
            else                 tmp = 10
            for (let i = 0; i < tmp; i++)
                bits.push((last >> tmp-1-i) % 2)
        } else if (MODE === 2) {// Character and Number Mode
            // AC-42 -> AC -4 2
            for (let i = 0, j = 0; i < str.length; i++, j++) {
                const code = Character_Code.indexOf(str.charAt(i))
                if (code === -1)
                    console.log('Unexpected letter:', str.charAt(i))
                
                if (i === strLEN - 1 && j % 2 === 0)
                    data_array.push(code) // Last letter
                else if (j % 2 === 0)
                    data_array.push(45*code) // First letter of two
                else
                    data_array[parseInt(j/2)] += code // Second letter
            }

            // String Length -> bits
            if      (this.VER <=  9) ccs =  9
            else if (this.VER <= 26) ccs = 11
            else if (this.VER <= 40) ccs = 13
            for (let i = 0; i < ccs; i++)
                bits.push((strLEN >> (ccs-1-i)) % 2)

            // Data Array -> bits
            const last = data_array.pop()
            for (const code of data_array)
            for (let i = 0; i < 11; i++)
                bits.push((code >> 10-i) % 2)
            let tmp = 0
            if (last < 45) tmp =  6
            else           tmp = 11
            for (let i = 0; i < tmp; i++)
                bits.push((last >> tmp-1-i) % 2)
        } else if (MODE === 3) {// Connect Mode
            this.error_message = 'Connect Mode is NOT implemented yet.'
        } else if (MODE === 4) {// Byte Mode
            // Hello! -> H e l l o !
            for (let i = 0, j = 0; i < str.length; i++, j++) {
                const code = Byte_Code.indexOf(str.charAt(i))
                if (code === -1)
                    console.log('Unexpected letter:', str.charAt(i))
                data_array.push(code)
            }

            // String Length -> bits
            if      (this.VER <=  9) ccs =  8
            else if (this.VER <= 40) ccs = 16
            for (let i = 0; i < ccs; i++)
                bits.push((strLEN >> (ccs-1-i)) % 2)

            // Data Array -> bits
            for (const code of data_array)
            for (let i = 0; i < 8; i++)
                bits.push((code >> 7-i) % 2)
        } else if (MODE === 7) {// ECI Mode
            this.error_message = 'ECI Mode is NOT implemented yet.'
        } else if (MODE === 8) {// Kanji Mode
            this.error_message = 'Kanji Mode is NOT implemented yet.'
        } else {
            this.error_message = 'This Mode is NOT implemented.'
        }

        for (const bit of [0, 0, 0, 0])
            bits.push(bit) // Termination Pattern
        while (bits.length % 8 !== 0)
            bits.push(0) // Padding bit

        const Block_Info = Block_List[this.VER][this.ECL]
        let all_data_codewords_num = 0
        for (const BI of Block_Info)
            all_data_codewords_num += BI.block_num * BI.data_codewords_num

        // bit Array -> 8 bit Word Array
        const data_codewords = []
        for (let i = 0; 0 < bits.length; i++) {
            data_codewords.push(bits.shift())
            for (let j = 1; j < 8; j++)
                data_codewords[i] = (data_codewords[i] << 1) + bits.shift()
        }
        if (all_data_codewords_num < data_codewords.length) {
            this.error_message = 'too much data'
            return
        }
        for (let i = 0; data_codewords.length < all_data_codewords_num; i++)
            data_codewords.push([236, 17][i % 2]) // Padding Code

        // Data Blocking
        const data_blocks = []
        for (const BI of Block_Info)
        for (let i = 0; i < BI.block_num; i++) {
            data_blocks.push([])
            for (let j = 0; j < BI.data_codewords_num; j++)
                data_blocks[data_blocks.length-1].push(data_codewords.shift())
        }

        // Generator Polynomial
        let gp
        for (const g of Generator_Polynomial)
            if (g.length === Block_Info[0].ec_codewords_num)
                gp = g.slice().reverse()

        // EC Blocking
        const ec_blocks = []
        for (const db of data_blocks)
            ec_blocks.push(db.slice())
        for (let i = 0; i < ec_blocks.length; i++) {
            for (let j = 0; j < gp.length; j++)
                ec_blocks[i].push(0)
            ec_blocks[i] = GaloisMod(ec_blocks[i], gp)
        }

        const data_ec_words = []
        // Data
        for (let i = 0; i < Block_Info[0].data_codewords_num; i++)
        for (const block of data_blocks)
            data_ec_words.push(block.shift())
        for (const block of data_blocks)
            if (block.length !== 0)
                data_ec_words.push(block[0])

        // EC
        for (let i = 0; i < Block_Info[0].ec_codewords_num; i++)
        for (const block of ec_blocks)
            data_ec_words.push(block.shift())
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