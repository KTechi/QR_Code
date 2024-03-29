// ================ Data Definition ================ //

'use strict'

window.addEventListener('load', function() {
    canvas = document.getElementById('canvas')
    context = canvas.getContext('2d')
    canvas.style.width  = '0px'
    canvas.style.height = '0px'
})

let canvas
let context

const Character_Code = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
    'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
    'U', 'V', 'W', 'X', 'Y', 'Z', ' ', '$', '%', '*',
    '+', '-', '.', '/', ':',
]
const Byte_Code = [
    '©', '©', '©', '©', '©', '©', '©', '©', '©', '©',
    '\n', '©', '©', '©', '©', '©', '©', '©', '©', '©',
    '©', '©', '©', '©', '©', '©', '©', '©', '©', '©',
    '©', '©', ' ', '!', '"', '#', '$', '%', '&','\'',
    '(', ')', '*', '+', ',', '-', '.', '/', '0', '1',

    '2', '3', '4', '5', '6', '7', '8', '9', ':', ';',
    '<', '=', '>', '?', '@', 'A', 'B', 'C', 'D', 'E',
    'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
    'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y',
    'Z', '[','\\', ']', '^', '_', '`', 'a', 'b', 'c',

    'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w',
    'x', 'y', 'z', '{', '|', '}', '~',
]
const EXP_A = [
      1,   2,   4,   8,  16,  32,  64, 128,  29,  58, //  10
    116, 232, 205, 135,  19,  38,  76, 152,  45,  90, //  20
    180, 117, 234, 201, 143,   3,   6,  12,  24,  48, //  30
     96, 192, 157,  39,  78, 156,  37,  74, 148,  53, //  40
    106, 212, 181, 119, 238, 193, 159,  35,  70, 140, //  50
      5,  10,  20,  40,  80, 160,  93, 186, 105, 210, //  60
    185, 111, 222, 161,  95, 190,  97, 194, 153,  47, //  70
     94, 188, 101, 202, 137,  15,  30,  60, 120, 240, //  80
    253, 231, 211, 187, 107, 214, 177, 127, 254, 225, //  90
    223, 163,  91, 182, 113, 226, 217, 175,  67, 134, // 100
     17,  34,  68, 136,  13,  26,  52, 104, 208, 189, // 110
    103, 206, 129,  31,  62, 124, 248, 237, 199, 147, // 120
     59, 118, 236, 197, 151,  51, 102, 204, 133,  23, // 130
     46,  92, 184, 109, 218, 169,  79, 158,  33,  66, // 140
    132,  21,  42,  84, 168,  77, 154,  41,  82, 164, // 150
     85, 170,  73, 146,  57, 114, 228, 213, 183, 115, // 160
    230, 209, 191,  99, 198, 145,  63, 126, 252, 229, // 170
    215, 179, 123, 246, 241, 255, 227, 219, 171,  75, // 180
    150,  49,  98, 196, 149,  55, 110, 220, 165,  87, // 190
    174,  65, 130,  25,  50, 100, 200, 141,   7,  14, // 200
     28,  56, 112, 224, 221, 167,  83, 166,  81, 162, // 210
     89, 178, 121, 242, 249, 239, 195, 155,  43,  86, // 220
    172,  69, 138,   9,  18,  36,  72, 144,  61, 122, // 230
    244, 245, 247, 243, 251, 235, 203, 139,  11,  22, // 240
     44,  88, 176, 125, 250, 233, 207, 131,  27,  54, // 250
    108, 216, 173,  71, 142, // 255
]
const LOG_A = [
      0,   0,   1,  25,   2,  50,  26, 198,   3, 223, //  10
     51, 238,  27, 104, 199,  75,   4, 100, 224,  14, //  20
     52, 141, 239, 129,  28, 193, 105, 248, 200,   8, //  30
     76, 113,   5, 138, 101,  47, 225,  36,  15,  33, //  40
     53, 147, 142, 218, 240,  18, 130,  69,  29, 181, //  50
    194, 125, 106,  39, 249, 185, 201, 154,   9, 120, //  60
     77, 228, 114, 166,   6, 191, 139,  98, 102, 221, //  70
     48, 253, 226, 152,  37, 179,  16, 145,  34, 136, //  80
     54, 208, 148, 206, 143, 150, 219, 189, 241, 210, //  90
     19,  92, 131,  56,  70,  64,  30,  66, 182, 163, // 100
    195,  72, 126, 110, 107,  58,  40,  84, 250, 133, // 110
    186,  61, 202,  94, 155, 159,  10,  21, 121,  43, // 120
     78, 212, 229, 172, 115, 243, 167,  87,   7, 112, // 130
    192, 247, 140, 128,  99,  13, 103,  74, 222, 237, // 140
     49, 197, 254,  24, 227, 165, 153, 119,  38, 184, // 150
    180, 124,  17,  68, 146, 217,  35,  32, 137,  46, // 160
     55,  63, 209,  91, 149, 188, 207, 205, 144, 135, // 170
    151, 178, 220, 252, 190,  97, 242,  86, 211, 171, // 180
     20,  42,  93, 158, 132,  60,  57,  83,  71, 109, // 190
     65, 162,  31,  45,  67, 216, 183, 123, 164, 118, // 200
    196,  23,  73, 236, 127,  12, 111, 246, 108, 161, // 210
     59,  82,  41, 157,  85, 170, 251,  96, 134, 177, // 220
    187, 204,  62,  90, 203,  89,  95, 176, 156, 169, // 230
    160,  81,  11, 245,  22, 235, 122, 117,  44, 215, // 240
     79, 174, 213, 233, 230, 231, 173, 232, 116, 214, // 250
    244, 234, 168,  80,  88, 175, // 256
]
const Generator_Polynomial = [
    /* 2*/[   1,  25],// 2
    /* 5*/[  10, 119, 166, 164, 113],// 5
    /* 6*/[  15, 176,   5, 134,   0, 166],// 6
    /* 7*/[  21, 102, 238, 149, 146, 229,  87],// 7
    /* 8*/[  28, 196, 252, 215, 249, 208, 238, 175],// 8
    /*10*/[  45,  32,  94,  64,  70, 118,  61,  46,  67, 251],// 10
    /*13*/[  78, 140, 206, 218, 130, 104, 106, 100,  86, 100, 176, 152,  74],// 13
    /*14*/[  91,  22,  59, 207,  87, 216, 137, 218, 124, 190,  48, 155, 249, 199],// 14
    /*15*/[ 105,  99,   5, 124, 140, 237,  58,  58,  51,  37, 202,  91,  61, 183,   8],// 15
    /*16*/[ 120, 225, 194, 182, 169, 147, 191,  91,   3,  76, 161, 102, 109, 107, 104, 120],// 16
    /*17*/[ 136, 163, 243,  39, 150,  99,  24, 147, 214, 206, 123, 239,  43,  78, 206, 139,  43],// 17
    /*18*/[ 153,  96,  98,   5, 179, 252, 148, 152, 187,  79, 170, 118,  97, 184,  94, 158, 234, 215],// 18
    /*20*/[ 190, 188, 212, 212, 164, 156, 239,  83, 225, 221, 180, 202, 187,  26, 163,  61,  50,  79,  60,  17],// 20
    /*22*/[ 231, 165, 105, 160, 134, 219,  80,  98, 172,   8,  74, 200,  53, 221, 109,  14, 230,  93, 242, 247, 171, 210],// 22
    /*24*/[  21, 227,  96,  87, 232, 117,   0, 111, 218, 228, 226, 192, 152, 169, 180, 159, 126, 251, 117, 211,  48, 135, 121, 229],// 24
    /*26*/[  70, 218, 145, 153, 227,  48, 102,  13, 142, 245,  21, 161,  53, 165,  28, 111, 201, 145,  17, 118, 182, 103,   2, 158, 125, 173],// 26
    /*28*/[ 123,   9,  37, 242, 119, 212, 195,  42,  87, 245,  43,  21, 201, 232,  27, 205, 147, 195, 190, 110, 180, 108, 234, 224, 104, 200, 223, 168],// 28
    /*30*/[ 180, 192,  40, 238, 216, 251,  37, 156, 130, 224, 193, 226, 173,  42, 125, 222,  96, 239,  86, 110,  48,  50, 182, 179,  31, 216, 152, 145, 173 , 41],// 30
    /*32*/[ 241, 220, 185, 254,  52,  80, 222,  28,  60, 171,  69,  38, 156,  80, 185, 120,  27,  89, 123, 242,  32, 138, 138, 209,  67,   4, 167, 249, 190, 106,   6,  10],// 32
    /*34*/[  51, 129,  62,  98,  13, 167, 129, 183,  61, 114,  70,  56, 103, 218, 239, 229, 158,  58, 125, 163, 140,  86, 193, 113,  94, 105,  19, 108,  21,  26,  94, 146,  77, 111],// 34
    /*36*/[ 120,  30, 233, 113, 251, 117, 196, 121,  74, 120, 177, 105, 210,  87,  37, 218,  63,  18, 107, 238, 248, 113, 152, 167,   0, 115, 152,  60, 234, 246,  31, 172,  16,  98, 183, 200],// 36
    /*40*/[  15,  35,  53, 232,  20,  72, 134, 125, 163,  47,  41,  88, 114, 181,  35, 175,   7, 170, 104, 226, 174, 187,  26,  53, 106, 235,  56, 163,  57, 247, 161, 128, 205, 128,  98, 252, 161,  79, 116,  59],// 40
    /*42*/[  96,  50, 117, 194, 162, 171, 123, 201, 254, 237, 199, 213, 101,  39, 223, 101,  34, 139, 131,  15, 147,  96, 106, 188,   8, 230,  84, 110, 191, 221, 242,  58,   3,   0, 231, 137,  18,  25, 230, 221, 103, 250],// 42
    /*44*/[ 181,  73, 102, 113, 130,  37, 169, 204, 147, 217, 194,  52, 163,  68, 114, 118, 126, 224,  62, 143,  78,  44, 238,   1, 247,  14, 145,   9, 123,  72,  25, 191, 243,  89, 188, 168,  55,  69, 246,  71, 121,  61,   7, 190],// 44
    /*46*/[  15,  82,  19, 223, 202,  43, 224, 157,  25,  52, 174, 119, 245, 249,   8, 234, 104,  73, 241,  60,  96,   4,   1,  36, 211, 169, 216, 135,  16,  58,  44, 129, 113,  54,   5,  89,  99, 187, 115, 202, 224, 253, 112,  88,  94, 112],// 46
    /*48*/[ 108,  34,  39, 163,  50,  84, 227,  94,  11, 191, 238, 140, 156, 247,  21,  91, 184, 120, 150,  95, 206, 107, 205, 182, 160, 135, 111, 221,  18, 115, 123,  46,  63, 178,  61, 240, 102,  39,  90, 251,  24,  60, 146, 211, 130, 196,  25, 228],// 48
    /*50*/[ 205, 133, 232, 215, 170, 124, 175, 235, 114, 228,  69, 124,  65, 113,  32, 189,  42,  77,  75, 242, 215, 242, 160, 130, 209, 126, 160,  32,  13,  46, 225, 203, 242, 195, 111, 209,   3,  35, 193, 203,  99, 209,  46, 118,   9, 164, 161, 157, 125, 232],// 50
    /*52*/[  51, 116, 254, 239,  33, 101, 220, 200, 242,  39,  97,  86,  76,  22, 121, 235, 233, 100, 113, 124,  65,  59,  94, 190,  89, 254, 134, 203, 242,  37, 145,  59,  14,  22, 215, 151, 233, 184,  19, 124, 127,  86,  46, 192,  89, 251, 220,  50, 186,  86,  50, 116],// 52
    /*54*/[ 156,  31,  76, 198,  31, 101,  59, 153,   8, 235, 201, 128,  80, 215, 108, 120,  43, 122,  25, 123,  79, 172, 175, 238, 254,  35, 245,  52, 192, 184,  95,  26, 165, 109, 218, 209,  58, 102, 225, 249, 184, 238,  50,  45,  65,  46,  21, 113, 221, 210,  87, 201,  26, 183],// 54
    /*56*/[  10,  61,  20, 207, 202, 154, 151, 247, 196,  27,  61, 163,  23,  96, 206, 152, 124, 101, 184, 239,  85,  10,  28, 190, 174, 177, 249, 182, 142, 127, 139,  12, 209, 170, 208, 135, 155, 254, 144,   6, 229, 202, 201,  36, 163, 248,  91,   2, 116, 112, 216, 164, 157, 107, 120, 106],// 56
    /*58*/[ 123, 148, 125, 233, 142, 159,  63,  41,  29, 117, 245, 206, 134, 127, 145,  29, 218, 129,   6, 214, 240, 122,  30,  24,  23, 125, 165,  65, 142, 253,  85, 206, 249, 152, 248, 192, 141, 176, 237, 154, 144, 210, 242, 251,  55, 235, 185, 200, 182, 252, 107,  62,  27,  66, 247,  26, 116,  82],// 58
    /*60*/[ 240,  33,   7,  89,  16, 209,  27,  70, 220, 190, 102,  65,  87, 194,  25,  84, 181,  30, 124,  11,  86, 121, 209, 160,  49, 238,  38,  37,  82, 160, 109, 101, 219, 115,  57, 198, 205,   2, 247, 100,   6, 127, 181,  28, 120, 219, 101, 211,  45, 219, 197, 226, 197, 243, 141,   9,  12,  26, 140, 107],// 60
    /*62*/[ 106, 110, 186,  36, 215, 127, 218, 182, 246,  26, 100, 200,   6, 115,  40, 213, 123, 147, 149, 229,  11, 235, 117, 221,  35, 181, 126, 212,  17, 194, 111,  70,  50,  72,  89, 223,  76,  70, 118, 243,  78, 135, 105,   7, 121,  58, 228,   2,  23,  37, 122,   0,  94, 214, 118, 248, 223,  71,  98, 113, 202,  65],// 62
    /*64*/[ 231, 213, 156, 217, 243, 178,  11, 204,  31, 242, 230, 140, 108,  99,  63, 238, 242, 125, 195, 195, 140,  47, 146, 184,  47,  91, 216,   4, 209, 218, 150, 208, 156, 145,  24,  29, 212, 199,  93, 160,  53, 127,  26, 119, 149, 141,  78, 200, 254, 187, 204, 177, 123,  92, 119,  68,  49, 159, 158,   7,   9, 175,  51,  45],// 64
    /*66*/[ 105,  45,  93, 132,  25, 171, 106,  67, 146,  76,  82, 168,  50, 106, 232,  34,  77, 217, 126, 240, 253,  80,  87,  63, 143, 121,  40, 236, 111,  77, 154,  44,   7,  95, 197, 169, 214,  72,  41, 101,  95, 111,  68, 178, 137,  65, 173,  95, 171, 197, 247, 139,  17,  81, 215,  13, 117,  46,  51, 162, 136, 136, 180, 222, 118,   5],// 66
    /*68*/[ 238, 163,   8,   5,   3, 127, 184, 101,  27, 235, 238,  43, 198, 175, 215,  82 , 32,  54,   2, 118, 225, 166, 241, 137, 125,  41, 177,  52, 231,  95,  97, 199,  52, 227,  89, 160, 173, 253,  84,  15,  84,  93, 151, 203, 220, 165, 202,  60,  52, 133, 205, 190, 101,  84, 150,  43, 254,  32, 160,  90,  70,  77,  93, 224,  33, 223, 159, 247],// 68
    //        0    1    2    3    4    5    6    7    8    9   10   11   12   13   14   15   16   17   18   19   20   21   22   23   24   25   26   27   28   29   30   31   32   33   34   35   36   37   38   39   40   41   42   43   44   45   46   47   48   49   50   51   52   53   54   55   56   57   58   59   60   61   62   63   64   65   66   67   68
]

function A(block_num, all_codewords_num, data_codewords_num) {
    return {
        block_num: block_num,
        all_codewords_num: all_codewords_num,
        data_codewords_num: data_codewords_num,
        ec_codewords_num: all_codewords_num - data_codewords_num,
    }
}
// Block_List[Version]['ECL']
const Block_List = {
    1: {L: [A(1, 26, 19)],
        M: [A(1, 26, 16)],
        Q: [A(1, 26, 13)],
        H: [A(1, 26,  9)]},
    2: {L: [A(1, 44, 34)],
        M: [A(1, 44, 28)],
        Q: [A(1, 44, 22)],
        H: [A(1, 44, 16)]},
    3: {L: [A(1, 70, 55)],
        M: [A(1, 70, 44)],
        Q: [A(2, 35, 17)],
        H: [A(2, 35, 13)]},
    4: {L: [A(1,100, 80)],
        M: [A(2, 50, 32)],
        Q: [A(2, 50, 24)],
        H: [A(4, 25,  9)]},
    5: {L: [A(1,134,108)],
        M: [A(2, 67, 43)],
        Q: [A(2, 33, 15), A(2, 34, 16)],
        H: [A(2, 33, 11), A(2, 34, 12)]},
    6: {L: [A(2, 86, 68)],
        M: [A(4, 43, 27)],
        Q: [A(4, 43, 19)],
        H: [A(4, 43, 15)]},
    7: {L: [A(2, 98, 78)],
        M: [A(4, 49, 31)],
        Q: [A(2, 32, 14), A(4, 33, 15)],
        H: [A(4, 39, 13), A(1, 40, 14)]},
    8: {L: [A(2,121, 97)],
        M: [A(2, 60, 38), A(2, 61, 39)],
        Q: [A(4, 40, 18), A(2, 41, 19)],
        H: [A(4, 40, 14), A(2, 41, 15)]},
    9: {L: [A(2,146,116)],
        M: [A(3, 58, 36), A(2, 59, 37)],
        Q: [A(4, 36, 16), A(4, 37, 17)],
        H: [A(4, 36, 12), A(4, 37, 13)]},
    10:{L: [A(2, 86, 68), A(2, 87, 69)],
        M: [A(4, 69, 43), A(1, 70, 44)],
        Q: [A(6, 43, 19), A(2, 44, 20)],
        H: [A(6, 43, 15), A(2, 44, 16)]},

    11:{L: [A( 4,101, 81)],
        M: [A( 1, 80, 50), A( 4, 81, 51)],
        Q: [A( 4, 50, 22), A( 4, 51, 23)],
        H: [A( 3, 36, 12), A( 8, 37, 13)]},
    12:{L: [A( 2,116, 92), A( 2,117, 93)],
        M: [A( 6, 58, 36), A( 2, 59, 37)],
        Q: [A( 4, 46, 20), A( 6, 47, 21)],
        H: [A( 7, 42, 14), A( 4, 43, 15)]},
    13:{L: [A( 4,133,107)],
        M: [A( 8, 59, 37), A( 1, 60, 38)],
        Q: [A( 8, 44, 20), A( 4, 45, 21)],
        H: [A(12, 33, 11), A( 4, 34, 12)]},
    14:{L: [A( 3,145,115), A( 1,146,116)],
        M: [A( 4, 64, 40), A( 5, 65, 41)],
        Q: [A(11, 36, 16), A( 5, 37, 17)],
        H: [A(11, 36, 12), A( 5, 37, 13)]},
    15:{L: [A( 5,109, 87), A( 1,110, 88)],
        M: [A( 5, 65, 41), A( 5, 66, 42)],
        Q: [A( 5, 54, 24), A( 7, 55, 25)],
        H: [A(11, 36, 12), A( 7, 37, 13)]},
    16:{L: [A( 5,122, 98), A( 1,123, 99)],
        M: [A( 7, 73, 45), A( 3, 74, 46)],
        Q: [A(15, 43, 19), A( 2, 44, 20)],
        H: [A( 3, 45, 15), A(13, 46, 16)]},
    17:{L: [A( 1,135,107), A( 5,136,108)],
        M: [A(10, 74, 46), A( 1, 75, 47)],
        Q: [A( 1, 50, 22), A(15, 51, 23)],
        H: [A( 2, 42, 14), A(17, 43, 15)]},
    18:{L: [A( 5,150,120), A( 1,151,121)],
        M: [A( 9, 69, 43), A( 4, 70, 44)],
        Q: [A(17, 50, 22), A( 1, 51, 23)],
        H: [A( 2, 42, 14), A(19, 43, 15)]},
    19:{L: [A( 3,141,113), A( 4,142,114)],
        M: [A( 3, 70, 44), A(11, 71, 45)],
        Q: [A(17, 47, 21), A( 4, 48, 22)],
        H: [A( 9, 39, 13), A(16, 40, 14)]},
    20:{L: [A( 3,135,107), A( 5,136,108)],
        M: [A( 3, 67, 41), A(13, 68, 42)],
        Q: [A(15, 54, 24), A( 5, 55, 25)],
        H: [A(15, 43, 15), A(10, 44, 16)]},

    21:{L: [A( 4,144,116), A( 4,145,117)],
        M: [A(17, 68, 42)],
        Q: [A(17, 50, 22), A( 6, 51, 23)],
        H: [A(19, 46, 16), A( 6, 47, 17)]},
    22:{L: [A( 2,139,111), A( 7,140,112)],
        M: [A(17, 74, 46)],
        Q: [A( 7, 54, 24), A(16, 55, 25)],
        H: [A(34, 37, 13)]},
    23:{L: [A( 4,151,121), A( 5,152,122)],
        M: [A( 4, 75, 47), A(14, 76, 48)],
        Q: [A(11, 54, 24), A(14, 55, 25)],
        H: [A(16, 45, 15), A(14, 46, 16)]},
    24:{L: [A( 6,147,117), A( 4,148,118)],
        M: [A( 6, 73, 45), A(14, 74, 46)],
        Q: [A(11, 54, 24), A(16, 55, 25)],
        H: [A(30, 46, 16), A( 2, 47, 17)]},
    25:{L: [A( 8,132,106), A( 4,133,107)],
        M: [A( 8, 75, 47), A(13, 76, 48)],
        Q: [A( 7, 54, 24), A(22, 55, 25)],
        H: [A(22, 45, 15), A(13, 46, 16)]},
    26:{L: [A(10,142,114), A( 2,143,115)],
        M: [A(19, 74, 46), A( 4, 75, 47)],
        Q: [A(28, 50, 22), A( 6, 51, 23)],
        H: [A(33, 46, 16), A( 4, 47, 17)]},
    27:{L: [A( 8,152,122), A( 4,153,123)],
        M: [A(22, 73, 45), A( 3, 74, 46)],
        Q: [A( 8, 53, 23), A(26, 54, 24)],
        H: [A(12, 45, 15), A(28, 46, 16)]},
    28:{L: [A( 3,147,117), A(10,148,118)],
        M: [A( 3, 73, 45), A(23, 74, 46)],
        Q: [A( 4, 54, 24), A(31, 55, 25)],
        H: [A(11, 45, 15), A(31, 46, 16)]},
    29:{L: [A( 7,146,116), A( 7,147,117)],
        M: [A(21, 73, 45), A( 7, 74, 46)],
        Q: [A( 1, 53, 23), A(37, 54, 24)],
        H: [A(19, 45, 15), A(26, 46, 16)]},
    30:{L: [A( 5,145,115), A(10,146,116)],
        M: [A(19, 75, 47), A(10, 76, 48)],
        Q: [A(15, 54, 24), A(25, 55, 25)],
        H: [A(23, 45, 15), A(25, 46, 16)]},

    31:{L: [A(13,145,115), A( 3,146,116)],
        M: [A( 2, 74, 46), A(29, 75, 47)],
        Q: [A(42, 54, 24), A( 1, 55, 25)],
        H: [A(23, 45, 15), A(28, 46, 16)]},
    32:{L: [A(17,145,115)],
        M: [A(10, 74, 46), A(23, 75, 47)],
        Q: [A(10, 54, 24), A(35, 55, 25)],
        H: [A(19, 45, 15), A(35, 46, 16)]},
    33:{L: [A(17,145,115), A( 1,146,116)],
        M: [A(14, 74, 46), A(21, 75, 47)],
        Q: [A(29, 54, 24), A(19, 55, 25)],
        H: [A(11, 45, 15), A(46, 46, 16)]},
    34:{L: [A(13,145,115), A( 6,146,116)],
        M: [A(14, 74, 46), A(23, 75, 47)],
        Q: [A(44, 54, 24), A( 7, 55, 25)],
        H: [A(59, 46, 16), A( 1, 47, 17)]},
    35:{L: [A(12,151,121), A( 7,152,122)],
        M: [A(12, 75, 47), A(26, 76, 48)],
        Q: [A(39, 54, 24), A(14, 55, 25)],
        H: [A(22, 45, 15), A(41, 46, 16)]},
    36:{L: [A( 6,151,121), A(14,152,122)],
        M: [A( 6, 75, 47), A(34, 76, 48)],
        Q: [A(46, 54, 24), A(10, 55, 25)],
        H: [A( 2, 45, 15), A(64, 46, 16)]},
    37:{L: [A(17,152,122), A( 4,153,123)],
        M: [A(29, 74, 46), A(14, 75, 47)],
        Q: [A(49, 54, 24), A(10, 55, 25)],
        H: [A(24, 45, 15), A(46, 46, 16)]},
    38:{L: [A( 4,152,122), A(18,153,123)],
        M: [A(13, 74, 46), A(32, 75, 47)],
        Q: [A(48, 54, 24), A(14, 55, 25)],
        H: [A(42, 45, 15), A(32, 46, 16)]},
    39:{L: [A(20,147,117), A( 4,148,118)],
        M: [A(40, 75, 47), A( 7, 76, 48)],
        Q: [A(43, 54, 24), A(22, 55, 25)],
        H: [A(10, 45, 15), A(67, 46, 16)]},
    40:{L: [A(19,148,118), A( 6,149,119)],
        M: [A(18, 75, 47), A(31, 76, 48)],
        Q: [A(34, 54, 24), A(34, 55, 25)],
        H: [A(20, 45, 15), A(61, 46, 16)]},
}
