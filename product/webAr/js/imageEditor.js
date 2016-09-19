(function(){

	/*
	  Copyright (c) 2008, Adobe Systems Incorporated
	  All rights reserved.

	  Redistribution and use in source and binary forms, with or without 
	  modification, are permitted provided that the following conditions are
	  met:

	  * Redistributions of source code must retain the above copyright notice, 
	    this list of conditions and the following disclaimer.
	  
	  * Redistributions in binary form must reproduce the above copyright
	    notice, this list of conditions and the following disclaimer in the 
	    documentation and/or other materials provided with the distribution.
	  
	  * Neither the name of Adobe Systems Incorporated nor the names of its 
	    contributors may be used to endorse or promote products derived from 
	    this software without specific prior written permission.

	  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
	  IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
	  THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
	  PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR 
	  CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
	  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
	  PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
	  PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
	  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
	  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
	  SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	*/
		/*
	JPEG encoder ported to JavaScript and optimized by Andreas Ritter, www.bytestrom.eu, 11/2009

	Basic GUI blocking jpeg encoder
	*/

	function JPEGEncoder(quality) {
		var self = this;
		var fround = Math.round;
		var ffloor = Math.floor;
		var YTable = new Array(64);
		var UVTable = new Array(64);
		var fdtbl_Y = new Array(64);
		var fdtbl_UV = new Array(64);
		var YDC_HT;
		var UVDC_HT;
		var YAC_HT;
		var UVAC_HT;

		var bitcode = new Array(65535);
		var category = new Array(65535);
		var outputfDCTQuant = new Array(64);
		var DU = new Array(64);
		var byteout = [];
		var bytenew = 0;
		var bytepos = 7;

		var YDU = new Array(64);
		var UDU = new Array(64);
		var VDU = new Array(64);
		var clt = new Array(256);
		var RGB_YUV_TABLE = new Array(2048);
		var currentQuality;

		var ZigZag = [
			0, 1, 5, 6, 14, 15, 27, 28,
			2, 4, 7, 13, 16, 26, 29, 42,
			3, 8, 12, 17, 25, 30, 41, 43,
			9, 11, 18, 24, 31, 40, 44, 53,
			10, 19, 23, 32, 39, 45, 52, 54,
			20, 22, 33, 38, 46, 51, 55, 60,
			21, 34, 37, 47, 50, 56, 59, 61,
			35, 36, 48, 49, 57, 58, 62, 63
		];

		var std_dc_luminance_nrcodes = [0, 0, 1, 5, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0];
		var std_dc_luminance_values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
		var std_ac_luminance_nrcodes = [0, 0, 2, 1, 3, 3, 2, 4, 3, 5, 5, 4, 4, 0, 0, 1, 0x7d];
		var std_ac_luminance_values = [
			0x01, 0x02, 0x03, 0x00, 0x04, 0x11, 0x05, 0x12,
			0x21, 0x31, 0x41, 0x06, 0x13, 0x51, 0x61, 0x07,
			0x22, 0x71, 0x14, 0x32, 0x81, 0x91, 0xa1, 0x08,
			0x23, 0x42, 0xb1, 0xc1, 0x15, 0x52, 0xd1, 0xf0,
			0x24, 0x33, 0x62, 0x72, 0x82, 0x09, 0x0a, 0x16,
			0x17, 0x18, 0x19, 0x1a, 0x25, 0x26, 0x27, 0x28,
			0x29, 0x2a, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39,
			0x3a, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49,
			0x4a, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59,
			0x5a, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69,
			0x6a, 0x73, 0x74, 0x75, 0x76, 0x77, 0x78, 0x79,
			0x7a, 0x83, 0x84, 0x85, 0x86, 0x87, 0x88, 0x89,
			0x8a, 0x92, 0x93, 0x94, 0x95, 0x96, 0x97, 0x98,
			0x99, 0x9a, 0xa2, 0xa3, 0xa4, 0xa5, 0xa6, 0xa7,
			0xa8, 0xa9, 0xaa, 0xb2, 0xb3, 0xb4, 0xb5, 0xb6,
			0xb7, 0xb8, 0xb9, 0xba, 0xc2, 0xc3, 0xc4, 0xc5,
			0xc6, 0xc7, 0xc8, 0xc9, 0xca, 0xd2, 0xd3, 0xd4,
			0xd5, 0xd6, 0xd7, 0xd8, 0xd9, 0xda, 0xe1, 0xe2,
			0xe3, 0xe4, 0xe5, 0xe6, 0xe7, 0xe8, 0xe9, 0xea,
			0xf1, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0xf7, 0xf8,
			0xf9, 0xfa
		];

		var std_dc_chrominance_nrcodes = [0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0];
		var std_dc_chrominance_values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
		var std_ac_chrominance_nrcodes = [0, 0, 2, 1, 2, 4, 4, 3, 4, 7, 5, 4, 4, 0, 1, 2, 0x77];
		var std_ac_chrominance_values = [
			0x00, 0x01, 0x02, 0x03, 0x11, 0x04, 0x05, 0x21,
			0x31, 0x06, 0x12, 0x41, 0x51, 0x07, 0x61, 0x71,
			0x13, 0x22, 0x32, 0x81, 0x08, 0x14, 0x42, 0x91,
			0xa1, 0xb1, 0xc1, 0x09, 0x23, 0x33, 0x52, 0xf0,
			0x15, 0x62, 0x72, 0xd1, 0x0a, 0x16, 0x24, 0x34,
			0xe1, 0x25, 0xf1, 0x17, 0x18, 0x19, 0x1a, 0x26,
			0x27, 0x28, 0x29, 0x2a, 0x35, 0x36, 0x37, 0x38,
			0x39, 0x3a, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48,
			0x49, 0x4a, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58,
			0x59, 0x5a, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68,
			0x69, 0x6a, 0x73, 0x74, 0x75, 0x76, 0x77, 0x78,
			0x79, 0x7a, 0x82, 0x83, 0x84, 0x85, 0x86, 0x87,
			0x88, 0x89, 0x8a, 0x92, 0x93, 0x94, 0x95, 0x96,
			0x97, 0x98, 0x99, 0x9a, 0xa2, 0xa3, 0xa4, 0xa5,
			0xa6, 0xa7, 0xa8, 0xa9, 0xaa, 0xb2, 0xb3, 0xb4,
			0xb5, 0xb6, 0xb7, 0xb8, 0xb9, 0xba, 0xc2, 0xc3,
			0xc4, 0xc5, 0xc6, 0xc7, 0xc8, 0xc9, 0xca, 0xd2,
			0xd3, 0xd4, 0xd5, 0xd6, 0xd7, 0xd8, 0xd9, 0xda,
			0xe2, 0xe3, 0xe4, 0xe5, 0xe6, 0xe7, 0xe8, 0xe9,
			0xea, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0xf7, 0xf8,
			0xf9, 0xfa
		];

		function initQuantTables(sf) {
			var YQT = [
				16, 11, 10, 16, 24, 40, 51, 61,
				12, 12, 14, 19, 26, 58, 60, 55,
				14, 13, 16, 24, 40, 57, 69, 56,
				14, 17, 22, 29, 51, 87, 80, 62,
				18, 22, 37, 56, 68, 109, 103, 77,
				24, 35, 55, 64, 81, 104, 113, 92,
				49, 64, 78, 87, 103, 121, 120, 101,
				72, 92, 95, 98, 112, 100, 103, 99
			];

			for (var i = 0; i < 64; i++) {
				var t = ffloor((YQT[i] * sf + 50) / 100);
				if (t < 1) {
					t = 1;
				} else if (t > 255) {
					t = 255;
				}
				YTable[ZigZag[i]] = t;
			}
			var UVQT = [
				17, 18, 24, 47, 99, 99, 99, 99,
				18, 21, 26, 66, 99, 99, 99, 99,
				24, 26, 56, 99, 99, 99, 99, 99,
				47, 66, 99, 99, 99, 99, 99, 99,
				99, 99, 99, 99, 99, 99, 99, 99,
				99, 99, 99, 99, 99, 99, 99, 99,
				99, 99, 99, 99, 99, 99, 99, 99,
				99, 99, 99, 99, 99, 99, 99, 99
			];
			for (var j = 0; j < 64; j++) {
				var u = ffloor((UVQT[j] * sf + 50) / 100);
				if (u < 1) {
					u = 1;
				} else if (u > 255) {
					u = 255;
				}
				UVTable[ZigZag[j]] = u;
			}
			var aasf = [
				1.0, 1.387039845, 1.306562965, 1.175875602,
				1.0, 0.785694958, 0.541196100, 0.275899379
			];
			var k = 0;
			for (var row = 0; row < 8; row++) {
				for (var col = 0; col < 8; col++) {
					fdtbl_Y[k] = (1.0 / (YTable[ZigZag[k]] * aasf[row] * aasf[col] * 8.0));
					fdtbl_UV[k] = (1.0 / (UVTable[ZigZag[k]] * aasf[row] * aasf[col] * 8.0));
					k++;
				}
			}
		}

		function computeHuffmanTbl(nrcodes, std_table) {
			var codevalue = 0;
			var pos_in_table = 0;
			var HT = new Array();
			for (var k = 1; k <= 16; k++) {
				for (var j = 1; j <= nrcodes[k]; j++) {
					HT[std_table[pos_in_table]] = [];
					HT[std_table[pos_in_table]][0] = codevalue;
					HT[std_table[pos_in_table]][1] = k;
					pos_in_table++;
					codevalue++;
				}
				codevalue *= 2;
			}
			return HT;
		}

		function initHuffmanTbl() {
			YDC_HT = computeHuffmanTbl(std_dc_luminance_nrcodes, std_dc_luminance_values);
			UVDC_HT = computeHuffmanTbl(std_dc_chrominance_nrcodes, std_dc_chrominance_values);
			YAC_HT = computeHuffmanTbl(std_ac_luminance_nrcodes, std_ac_luminance_values);
			UVAC_HT = computeHuffmanTbl(std_ac_chrominance_nrcodes, std_ac_chrominance_values);
		}

		function initCategoryNumber() {
			var nrlower = 1;
			var nrupper = 2;
			for (var cat = 1; cat <= 15; cat++) {
				//Positive numbers
				for (var nr = nrlower; nr < nrupper; nr++) {
					category[32767 + nr] = cat;
					bitcode[32767 + nr] = [];
					bitcode[32767 + nr][1] = cat;
					bitcode[32767 + nr][0] = nr;
				}
				//Negative numbers
				for (var nrneg = -(nrupper - 1); nrneg <= -nrlower; nrneg++) {
					category[32767 + nrneg] = cat;
					bitcode[32767 + nrneg] = [];
					bitcode[32767 + nrneg][1] = cat;
					bitcode[32767 + nrneg][0] = nrupper - 1 + nrneg;
				}
				nrlower <<= 1;
				nrupper <<= 1;
			}
		}

		function initRGBYUVTable() {
			for (var i = 0; i < 256; i++) {
				RGB_YUV_TABLE[i] = 19595 * i;
				RGB_YUV_TABLE[(i + 256) >> 0] = 38470 * i;
				RGB_YUV_TABLE[(i + 512) >> 0] = 7471 * i + 0x8000;
				RGB_YUV_TABLE[(i + 768) >> 0] = -11059 * i;
				RGB_YUV_TABLE[(i + 1024) >> 0] = -21709 * i;
				RGB_YUV_TABLE[(i + 1280) >> 0] = 32768 * i + 0x807FFF;
				RGB_YUV_TABLE[(i + 1536) >> 0] = -27439 * i;
				RGB_YUV_TABLE[(i + 1792) >> 0] = -5329 * i;
			}
		}

		// IO functions
		function writeBits(bs) {
			var value = bs[0];
			var posval = bs[1] - 1;
			while (posval >= 0) {
				if (value & (1 << posval)) {
					bytenew |= (1 << bytepos);
				}
				posval--;
				bytepos--;
				if (bytepos < 0) {
					if (bytenew == 0xFF) {
						writeByte(0xFF);
						writeByte(0);
					} else {
						writeByte(bytenew);
					}
					bytepos = 7;
					bytenew = 0;
				}
			}
		}

		function writeByte(value) {
			byteout.push(clt[value]); // write char directly instead of converting later
		}

		function writeWord(value) {
			writeByte((value >> 8) & 0xFF);
			writeByte((value) & 0xFF);
		}

		// DCT & quantization core
		function fDCTQuant(data, fdtbl) {
			var d0, d1, d2, d3, d4, d5, d6, d7;
			/* Pass 1: process rows. */
			var dataOff = 0;
			var i;
			const I8 = 8;
			const I64 = 64;
			for (i = 0; i < I8; ++i) {
				d0 = data[dataOff];
				d1 = data[dataOff + 1];
				d2 = data[dataOff + 2];
				d3 = data[dataOff + 3];
				d4 = data[dataOff + 4];
				d5 = data[dataOff + 5];
				d6 = data[dataOff + 6];
				d7 = data[dataOff + 7];

				var tmp0 = d0 + d7;
				var tmp7 = d0 - d7;
				var tmp1 = d1 + d6;
				var tmp6 = d1 - d6;
				var tmp2 = d2 + d5;
				var tmp5 = d2 - d5;
				var tmp3 = d3 + d4;
				var tmp4 = d3 - d4;

				/* Even part */
				var tmp10 = tmp0 + tmp3; /* phase 2 */
				var tmp13 = tmp0 - tmp3;
				var tmp11 = tmp1 + tmp2;
				var tmp12 = tmp1 - tmp2;

				data[dataOff] = tmp10 + tmp11; /* phase 3 */
				data[dataOff + 4] = tmp10 - tmp11;

				var z1 = (tmp12 + tmp13) * 0.707106781; /* c4 */
				data[dataOff + 2] = tmp13 + z1; /* phase 5 */
				data[dataOff + 6] = tmp13 - z1;

				/* Odd part */
				tmp10 = tmp4 + tmp5; /* phase 2 */
				tmp11 = tmp5 + tmp6;
				tmp12 = tmp6 + tmp7;

				/* The rotator is modified from fig 4-8 to avoid extra negations. */
				var z5 = (tmp10 - tmp12) * 0.382683433; /* c6 */
				var z2 = 0.541196100 * tmp10 + z5; /* c2-c6 */
				var z4 = 1.306562965 * tmp12 + z5; /* c2+c6 */
				var z3 = tmp11 * 0.707106781; /* c4 */

				var z11 = tmp7 + z3; /* phase 5 */
				var z13 = tmp7 - z3;

				data[dataOff + 5] = z13 + z2; /* phase 6 */
				data[dataOff + 3] = z13 - z2;
				data[dataOff + 1] = z11 + z4;
				data[dataOff + 7] = z11 - z4;

				dataOff += 8; /* advance pointer to next row */
			}

			/* Pass 2: process columns. */
			dataOff = 0;
			for (i = 0; i < I8; ++i) {
				d0 = data[dataOff];
				d1 = data[dataOff + 8];
				d2 = data[dataOff + 16];
				d3 = data[dataOff + 24];
				d4 = data[dataOff + 32];
				d5 = data[dataOff + 40];
				d6 = data[dataOff + 48];
				d7 = data[dataOff + 56];

				var tmp0p2 = d0 + d7;
				var tmp7p2 = d0 - d7;
				var tmp1p2 = d1 + d6;
				var tmp6p2 = d1 - d6;
				var tmp2p2 = d2 + d5;
				var tmp5p2 = d2 - d5;
				var tmp3p2 = d3 + d4;
				var tmp4p2 = d3 - d4;

				/* Even part */
				var tmp10p2 = tmp0p2 + tmp3p2; /* phase 2 */
				var tmp13p2 = tmp0p2 - tmp3p2;
				var tmp11p2 = tmp1p2 + tmp2p2;
				var tmp12p2 = tmp1p2 - tmp2p2;

				data[dataOff] = tmp10p2 + tmp11p2; /* phase 3 */
				data[dataOff + 32] = tmp10p2 - tmp11p2;

				var z1p2 = (tmp12p2 + tmp13p2) * 0.707106781; /* c4 */
				data[dataOff + 16] = tmp13p2 + z1p2; /* phase 5 */
				data[dataOff + 48] = tmp13p2 - z1p2;

				/* Odd part */
				tmp10p2 = tmp4p2 + tmp5p2; /* phase 2 */
				tmp11p2 = tmp5p2 + tmp6p2;
				tmp12p2 = tmp6p2 + tmp7p2;

				/* The rotator is modified from fig 4-8 to avoid extra negations. */
				var z5p2 = (tmp10p2 - tmp12p2) * 0.382683433; /* c6 */
				var z2p2 = 0.541196100 * tmp10p2 + z5p2; /* c2-c6 */
				var z4p2 = 1.306562965 * tmp12p2 + z5p2; /* c2+c6 */
				var z3p2 = tmp11p2 * 0.707106781; /* c4 */

				var z11p2 = tmp7p2 + z3p2; /* phase 5 */
				var z13p2 = tmp7p2 - z3p2;

				data[dataOff + 40] = z13p2 + z2p2; /* phase 6 */
				data[dataOff + 24] = z13p2 - z2p2;
				data[dataOff + 8] = z11p2 + z4p2;
				data[dataOff + 56] = z11p2 - z4p2;

				dataOff++; /* advance pointer to next column */
			}

			// Quantize/descale the coefficients
			var fDCTQuant;
			for (i = 0; i < I64; ++i) {
				// Apply the quantization and scaling factor & Round to nearest integer
				fDCTQuant = data[i] * fdtbl[i];
				outputfDCTQuant[i] = (fDCTQuant > 0.0) ? ((fDCTQuant + 0.5) | 0) : ((fDCTQuant - 0.5) | 0);
				//outputfDCTQuant[i] = fround(fDCTQuant);

			}
			return outputfDCTQuant;
		}

		function writeAPP0() {
			writeWord(0xFFE0); // marker
			writeWord(16); // length
			writeByte(0x4A); // J
			writeByte(0x46); // F
			writeByte(0x49); // I
			writeByte(0x46); // F
			writeByte(0); // = "JFIF",'\0'
			writeByte(1); // versionhi
			writeByte(1); // versionlo
			writeByte(0); // xyunits
			writeWord(1); // xdensity
			writeWord(1); // ydensity
			writeByte(0); // thumbnwidth
			writeByte(0); // thumbnheight
		}

		function writeSOF0(width, height) {
			writeWord(0xFFC0); // marker
			writeWord(17); // length, truecolor YUV JPG
			writeByte(8); // precision
			writeWord(height);
			writeWord(width);
			writeByte(3); // nrofcomponents
			writeByte(1); // IdY
			writeByte(0x11); // HVY
			writeByte(0); // QTY
			writeByte(2); // IdU
			writeByte(0x11); // HVU
			writeByte(1); // QTU
			writeByte(3); // IdV
			writeByte(0x11); // HVV
			writeByte(1); // QTV
		}

		function writeDQT() {
			writeWord(0xFFDB); // marker
			writeWord(132); // length
			writeByte(0);
			for (var i = 0; i < 64; i++) {
				writeByte(YTable[i]);
			}
			writeByte(1);
			for (var j = 0; j < 64; j++) {
				writeByte(UVTable[j]);
			}
		}

		function writeDHT() {
			writeWord(0xFFC4); // marker
			writeWord(0x01A2); // length

			writeByte(0); // HTYDCinfo
			for (var i = 0; i < 16; i++) {
				writeByte(std_dc_luminance_nrcodes[i + 1]);
			}
			for (var j = 0; j <= 11; j++) {
				writeByte(std_dc_luminance_values[j]);
			}

			writeByte(0x10); // HTYACinfo
			for (var k = 0; k < 16; k++) {
				writeByte(std_ac_luminance_nrcodes[k + 1]);
			}
			for (var l = 0; l <= 161; l++) {
				writeByte(std_ac_luminance_values[l]);
			}

			writeByte(1); // HTUDCinfo
			for (var m = 0; m < 16; m++) {
				writeByte(std_dc_chrominance_nrcodes[m + 1]);
			}
			for (var n = 0; n <= 11; n++) {
				writeByte(std_dc_chrominance_values[n]);
			}

			writeByte(0x11); // HTUACinfo
			for (var o = 0; o < 16; o++) {
				writeByte(std_ac_chrominance_nrcodes[o + 1]);
			}
			for (var p = 0; p <= 161; p++) {
				writeByte(std_ac_chrominance_values[p]);
			}
		}

		function writeSOS() {
			writeWord(0xFFDA); // marker
			writeWord(12); // length
			writeByte(3); // nrofcomponents
			writeByte(1); // IdY
			writeByte(0); // HTY
			writeByte(2); // IdU
			writeByte(0x11); // HTU
			writeByte(3); // IdV
			writeByte(0x11); // HTV
			writeByte(0); // Ss
			writeByte(0x3f); // Se
			writeByte(0); // Bf
		}

		function processDU(CDU, fdtbl, DC, HTDC, HTAC) {
			var EOB = HTAC[0x00];
			var M16zeroes = HTAC[0xF0];
			var pos;
			const I16 = 16;
			const I63 = 63;
			const I64 = 64;
			var DU_DCT = fDCTQuant(CDU, fdtbl);
			//ZigZag reorder
			for (var j = 0; j < I64; ++j) {
				DU[ZigZag[j]] = DU_DCT[j];
			}
			var Diff = DU[0] - DC;
			DC = DU[0];
			//Encode DC
			if (Diff == 0) {
				writeBits(HTDC[0]); // Diff might be 0
			} else {
				pos = 32767 + Diff;
				writeBits(HTDC[category[pos]]);
				writeBits(bitcode[pos]);
			}
			//Encode ACs
			var end0pos = 63; // was const... which is crazy
			for (;
				(end0pos > 0) && (DU[end0pos] == 0); end0pos--) {};
			//end0pos = first element in reverse order !=0
			if (end0pos == 0) {
				writeBits(EOB);
				return DC;
			}
			var i = 1;
			var lng;
			while (i <= end0pos) {
				var startpos = i;
				for (;
					(DU[i] == 0) && (i <= end0pos); ++i) {}
				var nrzeroes = i - startpos;
				if (nrzeroes >= I16) {
					lng = nrzeroes >> 4;
					for (var nrmarker = 1; nrmarker <= lng; ++nrmarker)
						writeBits(M16zeroes);
					nrzeroes = nrzeroes & 0xF;
				}
				pos = 32767 + DU[i];
				writeBits(HTAC[(nrzeroes << 4) + category[pos]]);
				writeBits(bitcode[pos]);
				i++;
			}
			if (end0pos != I63) {
				writeBits(EOB);
			}
			return DC;
		}

		function initCharLookupTable() {
			var sfcc = String.fromCharCode;
			for (var i = 0; i < 256; i++) { ///// ACHTUNG // 255
				clt[i] = sfcc(i);
			}
		}

		this.encode = function(image, quality) // image data object
		{
			var time_start = new Date().getTime();

			if (quality) setQuality(quality);

			// Initialize bit writer
			byteout = new Array();
			bytenew = 0;
			bytepos = 7;

			// Add JPEG headers
			writeWord(0xFFD8); // SOI
			writeAPP0();
			writeDQT();
			writeSOF0(image.width, image.height);
			writeDHT();
			writeSOS();


			// Encode 8x8 macroblocks
			var DCY = 0;
			var DCU = 0;
			var DCV = 0;

			bytenew = 0;
			bytepos = 7;


			this.encode.displayName = "_encode_";

			var imageData = image.data;
			var width = image.width;
			var height = image.height;

			var quadWidth = width * 4;
			var tripleWidth = width * 3;

			var x, y = 0;
			var r, g, b;
			var start, p, col, row, pos;
			while (y < height) {
				x = 0;
				while (x < quadWidth) {
					start = quadWidth * y + x;
					p = start;
					col = -1;
					row = 0;

					for (pos = 0; pos < 64; pos++) {
						row = pos >> 3; // /8
						col = (pos & 7) * 4; // %8
						p = start + (row * quadWidth) + col;

						if (y + row >= height) { // padding bottom
							p -= (quadWidth * (y + 1 + row - height));
						}

						if (x + col >= quadWidth) { // padding right	
							p -= ((x + col) - quadWidth + 4)
						}

						r = imageData[p++];
						g = imageData[p++];
						b = imageData[p++];


						/* // calculate YUV values dynamically
					YDU[pos]=((( 0.29900)*r+( 0.58700)*g+( 0.11400)*b))-128; //-0x80
					UDU[pos]=(((-0.16874)*r+(-0.33126)*g+( 0.50000)*b));
					VDU[pos]=((( 0.50000)*r+(-0.41869)*g+(-0.08131)*b));
					*/

						// use lookup table (slightly faster)
						YDU[pos] = ((RGB_YUV_TABLE[r] + RGB_YUV_TABLE[(g + 256) >> 0] + RGB_YUV_TABLE[(b + 512) >> 0]) >> 16) - 128;
						UDU[pos] = ((RGB_YUV_TABLE[(r + 768) >> 0] + RGB_YUV_TABLE[(g + 1024) >> 0] + RGB_YUV_TABLE[(b + 1280) >> 0]) >> 16) - 128;
						VDU[pos] = ((RGB_YUV_TABLE[(r + 1280) >> 0] + RGB_YUV_TABLE[(g + 1536) >> 0] + RGB_YUV_TABLE[(b + 1792) >> 0]) >> 16) - 128;

					}

					DCY = processDU(YDU, fdtbl_Y, DCY, YDC_HT, YAC_HT);
					DCU = processDU(UDU, fdtbl_UV, DCU, UVDC_HT, UVAC_HT);
					DCV = processDU(VDU, fdtbl_UV, DCV, UVDC_HT, UVAC_HT);
					x += 32;
				}
				y += 8;
			}


			////////////////////////////////////////////////////////////////

			// Do the bit alignment of the EOI marker
			if (bytepos >= 0) {
				var fillbits = [];
				fillbits[1] = bytepos + 1;
				fillbits[0] = (1 << (bytepos + 1)) - 1;
				writeBits(fillbits);
			}

			writeWord(0xFFD9); //EOI

			var jpegDataUri = 'data:image/jpeg;base64,' + btoa(byteout.join(''));

			byteout = [];

			// benchmarking
			var duration = new Date().getTime() - time_start;
			console.log('Encoding time: ' + duration + 'ms');
			//

			return jpegDataUri
		}

		function setQuality(quality) {
			if (quality <= 0) {
				quality = 1;
			}
			if (quality > 100) {
				quality = 100;
			}

			if (currentQuality == quality) return // don't recalc if unchanged

			var sf = 0;
			if (quality < 50) {
				sf = Math.floor(5000 / quality);
			} else {
				sf = Math.floor(200 - quality * 2);
			}

			initQuantTables(sf);
			currentQuality = quality;
			console.log('Quality set to: ' + quality + '%');
		}

		function init() {
			var time_start = new Date().getTime();
			if (!quality) quality = 50;
			// Create tables
			initCharLookupTable()
			initHuffmanTbl();
			initCategoryNumber();
			initRGBYUVTable();

			setQuality(quality);
			var duration = new Date().getTime() - time_start;
			console.log('Initialization ' + duration + 'ms');
		}

		init();

	};

	// helper function to get the imageData of an existing image on the current page.
	function getImageDataFromImage(idOrElement) {
		var theImg = (typeof(idOrElement) == 'string') ? document.getElementById(idOrElement) : idOrElement;
		var cvs = document.createElement('canvas');
		cvs.width = theImg.width;
		cvs.height = theImg.height;
		var ctx = cvs.getContext("2d");
		ctx.drawImage(theImg, 0, 0);

		return (ctx.getImageData(0, 0, cvs.width, cvs.height));
	}
	/*

function init(qu){
	var theImg = document.getElementById('testimage');
	var cvs = document.createElement('canvas');
	cvs.width = theImg.width;
	cvs.height = theImg.height;

	//document.body.appendChild(cvs);

	var ctx = cvs.getContext("2d");

	ctx.drawImage(theImg,0,0);

	var theImgData = (ctx.getImageData(0, 0, cvs.width, cvs.height));


	var jpegURI = encoder.encode(theImgData,qu);

	var img = document.createElement('img');
	img.src = jpegURI;
	document.body.appendChild(img);
}
*/


	window.JPEGEncoder = JPEGEncoder;

})();

/*===================filePath:[src/resource/exif.js]======================*/
(function(){

	/*
	 * Javascript EXIF Reader 0.1.4
	 * Copyright (c) 2008 Jacob Seidelin, cupboy@gmail.com, http://blog.nihilogic.dk/
	 * Licensed under the MPL License [http://www.nihilogic.dk/licenses/mpl-license.txt]
	 */


	window.EXIF = {};

	(function() {

		var bDebug = false;

		EXIF.Tags = {

			// version tags
			0x9000: "ExifVersion", // EXIF version
			0xA000: "FlashpixVersion", // Flashpix format version

			// colorspace tags
			0xA001: "ColorSpace", // Color space information tag

			// image configuration
			0xA002: "PixelXDimension", // Valid width of meaningful image
			0xA003: "PixelYDimension", // Valid height of meaningful image
			0x9101: "ComponentsConfiguration", // Information about channels
			0x9102: "CompressedBitsPerPixel", // Compressed bits per pixel

			// user information
			0x927C: "MakerNote", // Any desired information written by the manufacturer
			0x9286: "UserComment", // Comments by user

			// related file
			0xA004: "RelatedSoundFile", // Name of related sound file

			// date and time
			0x9003: "DateTimeOriginal", // Date and time when the original image was generated
			0x9004: "DateTimeDigitized", // Date and time when the image was stored digitally
			0x9290: "SubsecTime", // Fractions of seconds for DateTime
			0x9291: "SubsecTimeOriginal", // Fractions of seconds for DateTimeOriginal
			0x9292: "SubsecTimeDigitized", // Fractions of seconds for DateTimeDigitized

			// picture-taking conditions
			0x829A: "ExposureTime", // Exposure time (in seconds)
			0x829D: "FNumber", // F number
			0x8822: "ExposureProgram", // Exposure program
			0x8824: "SpectralSensitivity", // Spectral sensitivity
			0x8827: "ISOSpeedRatings", // ISO speed rating
			0x8828: "OECF", // Optoelectric conversion factor
			0x9201: "ShutterSpeedValue", // Shutter speed
			0x9202: "ApertureValue", // Lens aperture
			0x9203: "BrightnessValue", // Value of brightness
			0x9204: "ExposureBias", // Exposure bias
			0x9205: "MaxApertureValue", // Smallest F number of lens
			0x9206: "SubjectDistance", // Distance to subject in meters
			0x9207: "MeteringMode", // Metering mode
			0x9208: "LightSource", // Kind of light source
			0x9209: "Flash", // Flash status
			0x9214: "SubjectArea", // Location and area of main subject
			0x920A: "FocalLength", // Focal length of the lens in mm
			0xA20B: "FlashEnergy", // Strobe energy in BCPS
			0xA20C: "SpatialFrequencyResponse", // 
			0xA20E: "FocalPlaneXResolution", // Number of pixels in width direction per FocalPlaneResolutionUnit
			0xA20F: "FocalPlaneYResolution", // Number of pixels in height direction per FocalPlaneResolutionUnit
			0xA210: "FocalPlaneResolutionUnit", // Unit for measuring FocalPlaneXResolution and FocalPlaneYResolution
			0xA214: "SubjectLocation", // Location of subject in image
			0xA215: "ExposureIndex", // Exposure index selected on camera
			0xA217: "SensingMethod", // Image sensor type
			0xA300: "FileSource", // Image source (3 == DSC)
			0xA301: "SceneType", // Scene type (1 == directly photographed)
			0xA302: "CFAPattern", // Color filter array geometric pattern
			0xA401: "CustomRendered", // Special processing
			0xA402: "ExposureMode", // Exposure mode
			0xA403: "WhiteBalance", // 1 = auto white balance, 2 = manual
			0xA404: "DigitalZoomRation", // Digital zoom ratio
			0xA405: "FocalLengthIn35mmFilm", // Equivalent foacl length assuming 35mm film camera (in mm)
			0xA406: "SceneCaptureType", // Type of scene
			0xA407: "GainControl", // Degree of overall image gain adjustment
			0xA408: "Contrast", // Direction of contrast processing applied by camera
			0xA409: "Saturation", // Direction of saturation processing applied by camera
			0xA40A: "Sharpness", // Direction of sharpness processing applied by camera
			0xA40B: "DeviceSettingDescription", // 
			0xA40C: "SubjectDistanceRange", // Distance to subject

			// other tags
			0xA005: "InteroperabilityIFDPointer",
			0xA420: "ImageUniqueID" // Identifier assigned uniquely to each image
		};

		EXIF.TiffTags = {
			0x0100: "ImageWidth",
			0x0101: "ImageHeight",
			0x8769: "ExifIFDPointer",
			0x8825: "GPSInfoIFDPointer",
			0xA005: "InteroperabilityIFDPointer",
			0x0102: "BitsPerSample",
			0x0103: "Compression",
			0x0106: "PhotometricInterpretation",
			0x0112: "Orientation",
			0x0115: "SamplesPerPixel",
			0x011C: "PlanarConfiguration",
			0x0212: "YCbCrSubSampling",
			0x0213: "YCbCrPositioning",
			0x011A: "XResolution",
			0x011B: "YResolution",
			0x0128: "ResolutionUnit",
			0x0111: "StripOffsets",
			0x0116: "RowsPerStrip",
			0x0117: "StripByteCounts",
			0x0201: "JPEGInterchangeFormat",
			0x0202: "JPEGInterchangeFormatLength",
			0x012D: "TransferFunction",
			0x013E: "WhitePoint",
			0x013F: "PrimaryChromaticities",
			0x0211: "YCbCrCoefficients",
			0x0214: "ReferenceBlackWhite",
			0x0132: "DateTime",
			0x010E: "ImageDescription",
			0x010F: "Make",
			0x0110: "Model",
			0x0131: "Software",
			0x013B: "Artist",
			0x8298: "Copyright"
		}

		EXIF.GPSTags = {
			0x0000: "GPSVersionID",
			0x0001: "GPSLatitudeRef",
			0x0002: "GPSLatitude",
			0x0003: "GPSLongitudeRef",
			0x0004: "GPSLongitude",
			0x0005: "GPSAltitudeRef",
			0x0006: "GPSAltitude",
			0x0007: "GPSTimeStamp",
			0x0008: "GPSSatellites",
			0x0009: "GPSStatus",
			0x000A: "GPSMeasureMode",
			0x000B: "GPSDOP",
			0x000C: "GPSSpeedRef",
			0x000D: "GPSSpeed",
			0x000E: "GPSTrackRef",
			0x000F: "GPSTrack",
			0x0010: "GPSImgDirectionRef",
			0x0011: "GPSImgDirection",
			0x0012: "GPSMapDatum",
			0x0013: "GPSDestLatitudeRef",
			0x0014: "GPSDestLatitude",
			0x0015: "GPSDestLongitudeRef",
			0x0016: "GPSDestLongitude",
			0x0017: "GPSDestBearingRef",
			0x0018: "GPSDestBearing",
			0x0019: "GPSDestDistanceRef",
			0x001A: "GPSDestDistance",
			0x001B: "GPSProcessingMethod",
			0x001C: "GPSAreaInformation",
			0x001D: "GPSDateStamp",
			0x001E: "GPSDifferential"
		}

		EXIF.StringValues = {
			ExposureProgram: {
				0: "Not defined",
				1: "Manual",
				2: "Normal program",
				3: "Aperture priority",
				4: "Shutter priority",
				5: "Creative program",
				6: "Action program",
				7: "Portrait mode",
				8: "Landscape mode"
			},
			MeteringMode: {
				0: "Unknown",
				1: "Average",
				2: "CenterWeightedAverage",
				3: "Spot",
				4: "MultiSpot",
				5: "Pattern",
				6: "Partial",
				255: "Other"
			},
			LightSource: {
				0: "Unknown",
				1: "Daylight",
				2: "Fluorescent",
				3: "Tungsten (incandescent light)",
				4: "Flash",
				9: "Fine weather",
				10: "Cloudy weather",
				11: "Shade",
				12: "Daylight fluorescent (D 5700 - 7100K)",
				13: "Day white fluorescent (N 4600 - 5400K)",
				14: "Cool white fluorescent (W 3900 - 4500K)",
				15: "White fluorescent (WW 3200 - 3700K)",
				17: "Standard light A",
				18: "Standard light B",
				19: "Standard light C",
				20: "D55",
				21: "D65",
				22: "D75",
				23: "D50",
				24: "ISO studio tungsten",
				255: "Other"
			},
			Flash: {
				0x0000: "Flash did not fire",
				0x0001: "Flash fired",
				0x0005: "Strobe return light not detected",
				0x0007: "Strobe return light detected",
				0x0009: "Flash fired, compulsory flash mode",
				0x000D: "Flash fired, compulsory flash mode, return light not detected",
				0x000F: "Flash fired, compulsory flash mode, return light detected",
				0x0010: "Flash did not fire, compulsory flash mode",
				0x0018: "Flash did not fire, auto mode",
				0x0019: "Flash fired, auto mode",
				0x001D: "Flash fired, auto mode, return light not detected",
				0x001F: "Flash fired, auto mode, return light detected",
				0x0020: "No flash function",
				0x0041: "Flash fired, red-eye reduction mode",
				0x0045: "Flash fired, red-eye reduction mode, return light not detected",
				0x0047: "Flash fired, red-eye reduction mode, return light detected",
				0x0049: "Flash fired, compulsory flash mode, red-eye reduction mode",
				0x004D: "Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",
				0x004F: "Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",
				0x0059: "Flash fired, auto mode, red-eye reduction mode",
				0x005D: "Flash fired, auto mode, return light not detected, red-eye reduction mode",
				0x005F: "Flash fired, auto mode, return light detected, red-eye reduction mode"
			},
			SensingMethod: {
				1: "Not defined",
				2: "One-chip color area sensor",
				3: "Two-chip color area sensor",
				4: "Three-chip color area sensor",
				5: "Color sequential area sensor",
				7: "Trilinear sensor",
				8: "Color sequential linear sensor"
			},
			SceneCaptureType: {
				0: "Standard",
				1: "Landscape",
				2: "Portrait",
				3: "Night scene"
			},
			SceneType: {
				1: "Directly photographed"
			},
			CustomRendered: {
				0: "Normal process",
				1: "Custom process"
			},
			WhiteBalance: {
				0: "Auto white balance",
				1: "Manual white balance"
			},
			GainControl: {
				0: "None",
				1: "Low gain up",
				2: "High gain up",
				3: "Low gain down",
				4: "High gain down"
			},
			Contrast: {
				0: "Normal",
				1: "Soft",
				2: "Hard"
			},
			Saturation: {
				0: "Normal",
				1: "Low saturation",
				2: "High saturation"
			},
			Sharpness: {
				0: "Normal",
				1: "Soft",
				2: "Hard"
			},
			SubjectDistanceRange: {
				0: "Unknown",
				1: "Macro",
				2: "Close view",
				3: "Distant view"
			},
			FileSource: {
				3: "DSC"
			},

			Components: {
				0: "",
				1: "Y",
				2: "Cb",
				3: "Cr",
				4: "R",
				5: "G",
				6: "B"
			}
		}

		function addEvent(oElement, strEvent, fncHandler) {
			if (oElement.addEventListener) {
				oElement.addEventListener(strEvent, fncHandler, false);
			} else if (oElement.attachEvent) {
				oElement.attachEvent("on" + strEvent, fncHandler);
			}
		}


		function imageHasData(oImg) {
			return !!(oImg.exifdata);
		}

		function getImageData(oImg, fncCallback) {
			BinaryAjax(
				oImg.src,
				function(oHTTP) {
					var oEXIF = findEXIFinJPEG(oHTTP.binaryResponse);
					oImg.exifdata = oEXIF || {};
					if (fncCallback) fncCallback();
				}
			)
		}

		function findEXIFinJPEG(oFile) {
			var aMarkers = [];

			if (oFile.getByteAt(0) != 0xFF || oFile.getByteAt(1) != 0xD8) {
				return false; // not a valid jpeg
			}

			var iOffset = 2;
			var iLength = oFile.getLength();
			while (iOffset < iLength) {
				if (oFile.getByteAt(iOffset) != 0xFF) {
					if (bDebug) console.log("Not a valid marker at offset " + iOffset + ", found: " + oFile.getByteAt(iOffset));
					return false; // not a valid marker, something is wrong
				}

				var iMarker = oFile.getByteAt(iOffset + 1);

				// we could implement handling for other markers here, 
				// but we're only looking for 0xFFE1 for EXIF data

				if (iMarker == 22400) {
					if (bDebug) console.log("Found 0xFFE1 marker");
					return readEXIFData(oFile, iOffset + 4, oFile.getShortAt(iOffset + 2, true) - 2);
					iOffset += 2 + oFile.getShortAt(iOffset + 2, true);

				} else if (iMarker == 225) {
					// 0xE1 = Application-specific 1 (for EXIF)
					if (bDebug) console.log("Found 0xFFE1 marker");
					return readEXIFData(oFile, iOffset + 4, oFile.getShortAt(iOffset + 2, true) - 2);

				} else {
					iOffset += 2 + oFile.getShortAt(iOffset + 2, true);
				}

			}

		}


		function readTags(oFile, iTIFFStart, iDirStart, oStrings, bBigEnd) {
			var iEntries = oFile.getShortAt(iDirStart, bBigEnd);
			var oTags = {};
			for (var i = 0; i < iEntries; i++) {
				var iEntryOffset = iDirStart + i * 12 + 2;
				var strTag = oStrings[oFile.getShortAt(iEntryOffset, bBigEnd)];
				if (!strTag && bDebug) console.log("Unknown tag: " + oFile.getShortAt(iEntryOffset, bBigEnd));
				oTags[strTag] = readTagValue(oFile, iEntryOffset, iTIFFStart, iDirStart, bBigEnd);
			}
			return oTags;
		}


		function readTagValue(oFile, iEntryOffset, iTIFFStart, iDirStart, bBigEnd) {
			var iType = oFile.getShortAt(iEntryOffset + 2, bBigEnd);
			var iNumValues = oFile.getLongAt(iEntryOffset + 4, bBigEnd);
			var iValueOffset = oFile.getLongAt(iEntryOffset + 8, bBigEnd) + iTIFFStart;

			switch (iType) {
				case 1: // byte, 8-bit unsigned int
				case 7: // undefined, 8-bit byte, value depending on field
					if (iNumValues == 1) {
						return oFile.getByteAt(iEntryOffset + 8, bBigEnd);
					} else {
						var iValOffset = iNumValues > 4 ? iValueOffset : (iEntryOffset + 8);
						var aVals = [];
						for (var n = 0; n < iNumValues; n++) {
							aVals[n] = oFile.getByteAt(iValOffset + n);
						}
						return aVals;
					}
					break;

				case 2: // ascii, 8-bit byte
					var iStringOffset = iNumValues > 4 ? iValueOffset : (iEntryOffset + 8);
					return oFile.getStringAt(iStringOffset, iNumValues - 1);
					break;

				case 3: // short, 16 bit int
					if (iNumValues == 1) {
						return oFile.getShortAt(iEntryOffset + 8, bBigEnd);
					} else {
						var iValOffset = iNumValues > 2 ? iValueOffset : (iEntryOffset + 8);
						var aVals = [];
						for (var n = 0; n < iNumValues; n++) {
							aVals[n] = oFile.getShortAt(iValOffset + 2 * n, bBigEnd);
						}
						return aVals;
					}
					break;

				case 4: // long, 32 bit int
					if (iNumValues == 1) {
						return oFile.getLongAt(iEntryOffset + 8, bBigEnd);
					} else {
						var aVals = [];
						for (var n = 0; n < iNumValues; n++) {
							aVals[n] = oFile.getLongAt(iValueOffset + 4 * n, bBigEnd);
						}
						return aVals;
					}
					break;
				case 5: // rational = two long values, first is numerator, second is denominator
					if (iNumValues == 1) {
						return oFile.getLongAt(iValueOffset, bBigEnd) / oFile.getLongAt(iValueOffset + 4, bBigEnd);
					} else {
						var aVals = [];
						for (var n = 0; n < iNumValues; n++) {
							aVals[n] = oFile.getLongAt(iValueOffset + 8 * n, bBigEnd) / oFile.getLongAt(iValueOffset + 4 + 8 * n, bBigEnd);
						}
						return aVals;
					}
					break;
				case 9: // slong, 32 bit signed int
					if (iNumValues == 1) {
						return oFile.getSLongAt(iEntryOffset + 8, bBigEnd);
					} else {
						var aVals = [];
						for (var n = 0; n < iNumValues; n++) {
							aVals[n] = oFile.getSLongAt(iValueOffset + 4 * n, bBigEnd);
						}
						return aVals;
					}
					break;
				case 10: // signed rational, two slongs, first is numerator, second is denominator
					if (iNumValues == 1) {
						return oFile.getSLongAt(iValueOffset, bBigEnd) / oFile.getSLongAt(iValueOffset + 4, bBigEnd);
					} else {
						var aVals = [];
						for (var n = 0; n < iNumValues; n++) {
							aVals[n] = oFile.getSLongAt(iValueOffset + 8 * n, bBigEnd) / oFile.getSLongAt(iValueOffset + 4 + 8 * n, bBigEnd);
						}
						return aVals;
					}
					break;
			}
		}


		function readEXIFData(oFile, iStart, iLength) {
			if (oFile.getStringAt(iStart, 4) != "Exif") {
				if (bDebug) console.log("Not valid EXIF data! " + oFile.getStringAt(iStart, 4));
				return false;
			}

			var bBigEnd;

			var iTIFFOffset = iStart + 6;

			// test for TIFF validity and endianness
			if (oFile.getShortAt(iTIFFOffset) == 0x4949) {
				bBigEnd = false;
			} else if (oFile.getShortAt(iTIFFOffset) == 0x4D4D) {
				bBigEnd = true;
			} else {
				if (bDebug) console.log("Not valid TIFF data! (no 0x4949 or 0x4D4D)");
				return false;
			}

			if (oFile.getShortAt(iTIFFOffset + 2, bBigEnd) != 0x002A) {
				if (bDebug) console.log("Not valid TIFF data! (no 0x002A)");
				return false;
			}

			if (oFile.getLongAt(iTIFFOffset + 4, bBigEnd) != 0x00000008) {
				if (bDebug) console.log("Not valid TIFF data! (First offset not 8)", oFile.getShortAt(iTIFFOffset + 4, bBigEnd));
				return false;
			}

			var oTags = readTags(oFile, iTIFFOffset, iTIFFOffset + 8, EXIF.TiffTags, bBigEnd);

			if (oTags.ExifIFDPointer) {
				var oEXIFTags = readTags(oFile, iTIFFOffset, iTIFFOffset + oTags.ExifIFDPointer, EXIF.Tags, bBigEnd);
				for (var strTag in oEXIFTags) {
					switch (strTag) {
						case "LightSource":
						case "Flash":
						case "MeteringMode":
						case "ExposureProgram":
						case "SensingMethod":
						case "SceneCaptureType":
						case "SceneType":
						case "CustomRendered":
						case "WhiteBalance":
						case "GainControl":
						case "Contrast":
						case "Saturation":
						case "Sharpness":
						case "SubjectDistanceRange":
						case "FileSource":
							oEXIFTags[strTag] = EXIF.StringValues[strTag][oEXIFTags[strTag]];
							break;

						case "ExifVersion":
						case "FlashpixVersion":
							oEXIFTags[strTag] = String.fromCharCode(oEXIFTags[strTag][0], oEXIFTags[strTag][1], oEXIFTags[strTag][2], oEXIFTags[strTag][3]);
							break;

						case "ComponentsConfiguration":
							oEXIFTags[strTag] =
								EXIF.StringValues.Components[oEXIFTags[strTag][0]] + EXIF.StringValues.Components[oEXIFTags[strTag][1]] + EXIF.StringValues.Components[oEXIFTags[strTag][2]] + EXIF.StringValues.Components[oEXIFTags[strTag][3]];
							break;
					}
					oTags[strTag] = oEXIFTags[strTag];
				}
			}

			if (oTags.GPSInfoIFDPointer) {
				var oGPSTags = readTags(oFile, iTIFFOffset, iTIFFOffset + oTags.GPSInfoIFDPointer, EXIF.GPSTags, bBigEnd);
				for (var strTag in oGPSTags) {
					switch (strTag) {
						case "GPSVersionID":
							oGPSTags[strTag] = oGPSTags[strTag][0] + "." + oGPSTags[strTag][1] + "." + oGPSTags[strTag][2] + "." + oGPSTags[strTag][3];
							break;
					}
					oTags[strTag] = oGPSTags[strTag];
				}
			}

			return oTags;
		}


		EXIF.getData = function(oImg, fncCallback) {
			if (!oImg.complete) return false;
			if (!imageHasData(oImg)) {
				getImageData(oImg, fncCallback);
			} else {
				if (fncCallback) fncCallback();
			}
			return true;
		}

		EXIF.getTag = function(oImg, strTag) {
			if (!imageHasData(oImg)) return;
			return oImg.exifdata[strTag];
		}

		EXIF.getAllTags = function(oImg) {
			if (!imageHasData(oImg)) return {};
			var oData = oImg.exifdata;
			var oAllTags = {};
			for (var a in oData) {
				if (oData.hasOwnProperty(a)) {
					oAllTags[a] = oData[a];
				}
			}
			return oAllTags;
		}


		EXIF.pretty = function(oImg) {
			if (!imageHasData(oImg)) return "";
			var oData = oImg.exifdata;
			var strPretty = "";
			for (var a in oData) {
				if (oData.hasOwnProperty(a)) {
					if (typeof oData[a] == "object") {
						strPretty += a + " : [" + oData[a].length + " values]\r\n";
					} else {
						strPretty += a + " : " + oData[a] + "\r\n";
					}
				}
			}
			return strPretty;
		}

		EXIF.readFromBinaryFile = function(oFile) {
			return findEXIFinJPEG(oFile);
		}

		function loadAllImages() {
			var aImages = document.getElementsByTagName("img");
			for (var i = 0; i < aImages.length; i++) {
				if (aImages[i].getAttribute("exif") == "true") {
					if (!aImages[i].complete) {
						addEvent(aImages[i], "load",
							function() {
								EXIF.getData(this);
							}
						);
					} else {
						EXIF.getData(aImages[i]);
					}
				}
			}
		}

		addEvent(window, "load", loadAllImages);

	})();


})();

/*===================filePath:[src/resource/binaryajax.js]======================*/
(function(){
	/*
	 * Binary Ajax 0.1.10
	 * Copyright (c) 2008 Jacob Seidelin, cupboy@gmail.com, http://blog.nihilogic.dk/
	 * Licensed under the MPL License [http://www.nihilogic.dk/licenses/mpl-license.txt]
	 */


	window.BinaryFile = function(strData, iDataOffset, iDataLength) {
		var data = strData;
		var dataOffset = iDataOffset || 0;
		var dataLength = 0;

		this.getRawData = function() {
			return data;
		}

		if (typeof strData == "string") {
			dataLength = iDataLength || data.length;

			this.getByteAt = function(iOffset) {
				return data.charCodeAt(iOffset + dataOffset) & 0xFF;
			}

			this.getBytesAt = function(iOffset, iLength) {
				var aBytes = [];

				for (var i = 0; i < iLength; i++) {
					aBytes[i] = data.charCodeAt((iOffset + i) + dataOffset) & 0xFF
				};

				return aBytes;
			}
		} else if (typeof strData == "unknown") {
			dataLength = iDataLength || IEBinary_getLength(data);

			this.getByteAt = function(iOffset) {
				return IEBinary_getByteAt(data, iOffset + dataOffset);
			}

			this.getBytesAt = function(iOffset, iLength) {
				return new VBArray(IEBinary_getBytesAt(data, iOffset + dataOffset, iLength)).toArray();
			}
		}

		this.getLength = function() {
			return dataLength;
		}

		this.getSByteAt = function(iOffset) {
			var iByte = this.getByteAt(iOffset);
			if (iByte > 127)
				return iByte - 256;
			else
				return iByte;
		}

		this.getShortAt = function(iOffset, bBigEndian) {
			var iShort = bBigEndian ?
				(this.getByteAt(iOffset) << 8) + this.getByteAt(iOffset + 1) : (this.getByteAt(iOffset + 1) << 8) + this.getByteAt(iOffset)
			if (iShort < 0) iShort += 65536;
			return iShort;
		}
		this.getSShortAt = function(iOffset, bBigEndian) {
			var iUShort = this.getShortAt(iOffset, bBigEndian);
			if (iUShort > 32767)
				return iUShort - 65536;
			else
				return iUShort;
		}
		this.getLongAt = function(iOffset, bBigEndian) {
			var iByte1 = this.getByteAt(iOffset),
				iByte2 = this.getByteAt(iOffset + 1),
				iByte3 = this.getByteAt(iOffset + 2),
				iByte4 = this.getByteAt(iOffset + 3);

			var iLong = bBigEndian ?
				(((((iByte1 << 8) + iByte2) << 8) + iByte3) << 8) + iByte4 : (((((iByte4 << 8) + iByte3) << 8) + iByte2) << 8) + iByte1;
			if (iLong < 0) iLong += 4294967296;
			return iLong;
		}
		this.getSLongAt = function(iOffset, bBigEndian) {
			var iULong = this.getLongAt(iOffset, bBigEndian);
			if (iULong > 2147483647)
				return iULong - 4294967296;
			else
				return iULong;
		}

		this.getStringAt = function(iOffset, iLength) {
			var aStr = [];

			var aBytes = this.getBytesAt(iOffset, iLength);
			for (var j = 0; j < iLength; j++) {
				aStr[j] = String.fromCharCode(aBytes[j]);
			}
			return aStr.join("");
		}

		this.getCharAt = function(iOffset) {
			return String.fromCharCode(this.getByteAt(iOffset));
		}
		this.toBase64 = function() {
			return window.btoa(data);
		}
		this.fromBase64 = function(strBase64) {
			data = window.atob(strBase64);
		}
	}


	var BinaryAjax = (function() {

		function createRequest() {
			var oHTTP = null;
			if (window.ActiveXObject) {
				oHTTP = new ActiveXObject("Microsoft.XMLHTTP");
			} else if (window.XMLHttpRequest) {
				oHTTP = new XMLHttpRequest();
			}
			return oHTTP;
		}

		function getHead(strURL, fncCallback, fncError) {
			var oHTTP = createRequest();
			if (oHTTP) {
				if (fncCallback) {
					if (typeof(oHTTP.onload) != "undefined") {
						oHTTP.onload = function() {
							if (oHTTP.status == "200") {
								fncCallback(this);
							} else {
								if (fncError) fncError();
							}
							oHTTP = null;
						};
					} else {
						oHTTP.onreadystatechange = function() {
							if (oHTTP.readyState == 4) {
								if (oHTTP.status == "200") {
									fncCallback(this);
								} else {
									if (fncError) fncError();
								}
								oHTTP = null;
							}
						};
					}
				}
				oHTTP.open("HEAD", strURL, true);
				oHTTP.send(null);
			} else {
				if (fncError) fncError();
			}
		}

		function sendRequest(strURL, fncCallback, fncError, aRange, bAcceptRanges, iFileSize) {
			var oHTTP = createRequest();
			if (oHTTP) {

				var iDataOffset = 0;
				if (aRange && !bAcceptRanges) {
					iDataOffset = aRange[0];
				}
				var iDataLen = 0;
				if (aRange) {
					iDataLen = aRange[1] - aRange[0] + 1;
				}

				if (fncCallback) {
					if (typeof(oHTTP.onload) != "undefined") {
						oHTTP.onload = function() {
							if (oHTTP.status == "200" || oHTTP.status == "206" || oHTTP.status == "0") {
								oHTTP.binaryResponse = new BinaryFile(oHTTP.responseText, iDataOffset, iDataLen);
								oHTTP.fileSize = iFileSize || oHTTP.getResponseHeader("Content-Length");
								fncCallback(oHTTP);
							} else {
								if (fncError) fncError();
							}
							oHTTP = null;
						};
					} else {
						oHTTP.onreadystatechange = function() {
							if (oHTTP.readyState == 4) {
								if (oHTTP.status == "200" || oHTTP.status == "206" || oHTTP.status == "0") {
									// IE6 craps if we try to extend the XHR object
									var oRes = {
										status: oHTTP.status,
										// IE needs responseBody, Chrome/Safari needs responseText
										binaryResponse: new BinaryFile(
											typeof oHTTP.responseBody == "unknown" ? oHTTP.responseBody : oHTTP.responseText, iDataOffset, iDataLen
										),
										fileSize: iFileSize || oHTTP.getResponseHeader("Content-Length")
									};
									fncCallback(oRes);
								} else {
									if (fncError) fncError();
								}
								oHTTP = null;
							}
						};
					}
				}
				oHTTP.open("GET", strURL, true);

				if (oHTTP.overrideMimeType) oHTTP.overrideMimeType('text/plain; charset=x-user-defined');

				if (aRange && bAcceptRanges) {
					oHTTP.setRequestHeader("Range", "bytes=" + aRange[0] + "-" + aRange[1]);
				}

				oHTTP.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 1970 00:00:00 GMT");

				oHTTP.send(null);
			} else {
				if (fncError) fncError();
			}
		}

		return function(strURL, fncCallback, fncError, aRange) {

			if (aRange) {
				getHead(
					strURL,
					function(oHTTP) {
						var iLength = parseInt(oHTTP.getResponseHeader("Content-Length"), 10);
						var strAcceptRanges = oHTTP.getResponseHeader("Accept-Ranges");

						var iStart, iEnd;
						iStart = aRange[0];
						if (aRange[0] < 0)
							iStart += iLength;
						iEnd = iStart + aRange[1] - 1;

						sendRequest(strURL, fncCallback, fncError, [iStart, iEnd], (strAcceptRanges == "bytes"), iLength);
					}
				);

			} else {
				sendRequest(strURL, fncCallback, fncError);
			}
		}

	}());

	/*
document.write(
	"<script type='text/vbscript'>\r\n"
	+ "Function IEBinary_getByteAt(strBinary, iOffset)\r\n"
	+ "	IEBinary_getByteAt = AscB(MidB(strBinary,iOffset+1,1))\r\n"
	+ "End Function\r\n"
	+ "Function IEBinary_getLength(strBinary)\r\n"
	+ "	IEBinary_getLength = LenB(strBinary)\r\n"
	+ "End Function\r\n"
	+ "</script>\r\n"
);
*/

	document.write(
		"<script type='text/vbscript'>\r\n" + "Function IEBinary_getByteAt(strBinary, iOffset)\r\n" + "	IEBinary_getByteAt = AscB(MidB(strBinary, iOffset + 1, 1))\r\n" + "End Function\r\n" + "Function IEBinary_getBytesAt(strBinary, iOffset, iLength)\r\n" + "  Dim aBytes()\r\n" + "  ReDim aBytes(iLength - 1)\r\n" + "  For i = 0 To iLength - 1\r\n" + "   aBytes(i) = IEBinary_getByteAt(strBinary, iOffset + i)\r\n" + "  Next\r\n" + "  IEBinary_getBytesAt = aBytes\r\n" + "End Function\r\n" + "Function IEBinary_getLength(strBinary)\r\n" + "	IEBinary_getLength = LenB(strBinary)\r\n" + "End Function\r\n" + "</script>\r\n"
	);

})();

/*===================filePath:[src/resource/quark.base-1.0.0.js]======================*/
(function(){

	/*
	Quark 1.0.0 (build 121)
	Licensed under the MIT License.
	http://github.com/quark-dev-team/quarkjs
	*/


	(function(win) {

		/**
		 * Quark不是构造函数。
		 * @name Quark
		 * @class Quark是QuarkJS框架的全局对象，也是框架内部所有类的全局命名空间。在全局Q未被占用的情况下，也可以使用其缩写Q。
		 */
		var Quark = win.Quark = win.Quark || {
			global: win
		};


		var emptyConstructor = function() {};
		/**
		 * Quark框架的继承方法。
		 * @param {Function} childClass 子类。
		 * @param {Function} parentClass 父类。
		 */
		Quark.inherit = function(childClass, parentClass) {
			emptyConstructor.prototype = parentClass.prototype;
			childClass.superClass = parentClass.prototype;
			childClass.prototype = new emptyConstructor();
			childClass.prototype.constructor = childClass;
			//Quark.merge(childClass.prototype, parentClass.prototype);
		};

		/**
		 * 把props参数指定的属性或方法复制到obj对象上。
		 * @param {Object} obj Object对象。
		 * @param {Object} props 包含要复制到obj对象上的属性或方法的对象。
		 * @param {Boolean} strict 指定是否采用严格模式复制。默认为false。
		 * @return {Object} 复制后的obj对象。
		 */
		Quark.merge = function(obj, props, strict) {
			for (var key in props) {
				if (!strict || obj.hasOwnProperty(key) || obj[key] !== undefined) obj[key] = props[key];
			}
			return obj;
		};

		/**
		 * 改变func函数的作用域scope，即this的指向。
		 * @param {Function} func 要改变函数作用域的函数。
		 * @param {Object} self 指定func函数的作用对象。
		 * @return {Function} 一个作用域为参数self的功能与func相同的新函数。
		 */
		Quark.delegate = function(func, self) {
			var context = self || win;
			if (arguments.length > 2) {
				var args = Array.prototype.slice.call(arguments, 2);
				return function() {
					var newArgs = Array.prototype.concat.apply(args, arguments);
					return func.apply(context, newArgs);
				};
			} else {
				return function() {
					return func.apply(context, arguments);
				};
			}
		};

		/**
		 * 根据id获得DOM对象。
		 * @param {String} id DOM对象的id。
		 * @return {HTMLElement} DOM对象。
		 */
		Quark.getDOM = function(id) {
			return document.getElementById(id);
		};

		/**
		 * 创建一个指定类型type和属性props的DOM对象。
		 * @param {String} type 指定DOM的类型。比如canvas，div等。
		 * @param {Object} props 指定生成的DOM的属性对象。
		 * @return {HTMLElement} 新生成的DOM对象。
		 */
		Quark.createDOM = function(type, props) {
			var dom = document.createElement(type);
			for (var p in props) {
				var val = props[p];
				if (p == "style") {
					for (var s in val) dom.style[s] = val[s];
				} else {
					dom[p] = val;
				}
			}
			return dom;
		};

		/**
		 * 根据限定名称返回一个命名空间（从global开始）。如：Quark.use('Quark.test')。
		 * @param {String} 指定新的命名空间的名称。如Quark.test等。
		 * @return {Object} 参数name指定的命名空间对象。
		 */
		Quark.use = function(name) {
			var parts = name.split("."),
				obj = win;
			for (var i = 0; i < parts.length; i++) {
				var p = parts[i];
				obj = obj[p] || (obj[p] = {});
			}
			return obj;
		};

		/**
		 * 浏览器的特性的简单检测，并非精确判断。
		 */
		function detectBrowser(ns) {
			var ua = ns.ua = navigator.userAgent;
			ns.isWebKit = (/webkit/i).test(ua);
			ns.isMozilla = (/mozilla/i).test(ua);
			ns.isIE = (/msie/i).test(ua);
			ns.isFirefox = (/firefox/i).test(ua);
			ns.isChrome = (/chrome/i).test(ua);
			ns.isSafari = (/safari/i).test(ua) && !this.isChrome;
			ns.isMobile = (/mobile/i).test(ua);
			ns.isOpera = (/opera/i).test(ua);
			ns.isIOS = (/ios/i).test(ua);
			ns.isIpad = (/ipad/i).test(ua);
			ns.isIpod = (/ipod/i).test(ua);
			ns.isIphone = (/iphone/i).test(ua) && !this.isIpod;
			ns.isAndroid = (/android/i).test(ua);
			ns.supportStorage = "localStorage" in win;
			ns.supportOrientation = "orientation" in win;
			ns.supportDeviceMotion = "ondevicemotion" in win;
			ns.supportTouch = "ontouchstart" in win;
			ns.supportCanvas = document.createElement("canvas").getContext != null;
			ns.cssPrefix = ns.isWebKit ? "webkit" : ns.isFirefox ? "Moz" : ns.isOpera ? "O" : ns.isIE ? "ms" : "";
		};

		detectBrowser(Quark);

		/**
		 * 获取某个DOM元素在页面中的位置偏移量。格式为:{left: leftValue, top: topValue}。
		 * @param {HTMLElement} elem DOM元素。
		 * @return {Object} 指定DOM元素在页面中的位置偏移。格式为:{left: leftValue, top: topValue}。
		 */
		Quark.getElementOffset = function(elem) {
			var left = elem.offsetLeft,
				top = elem.offsetTop;
			while ((elem = elem.offsetParent) && elem != document.body && elem != document) {
				left += elem.offsetLeft;
				top += elem.offsetTop;
			}
			return {
				left: left,
				top: top
			};
		};

		/**
		 * 创建一个可渲染的DOM，可指定tagName，如canvas或div。
		 * @param {Object} disObj 一个DisplayObject或类似的对象。
		 * @param {Object} imageObj 指定渲染的image及相关设置，如绘制区域rect。
		 * @return {HTMLElement} 新创建的DOM对象。
		 */
		Quark.createDOMDrawable = function(disObj, imageObj) {
			var tag = disObj.tagName || "div";
			var img = imageObj.image;
			var w = disObj.width || (img && img.width);
			var h = disObj.height || (img && img.height);

			var elem = Quark.createDOM(tag);
			if (disObj.id) elem.id = disObj.id;
			elem.style.position = "absolute";
			elem.style.left = (disObj.left || 0) + "px";
			elem.style.top = (disObj.top || 0) + "px";
			elem.style.width = w + "px";
			elem.style.height = h + "px";

			if (tag == "canvas") {
				elem.width = w;
				elem.height = h;
				if (img) {
					var ctx = elem.getContext("2d");
					var rect = imageObj.rect || [0, 0, w, h];
					ctx.drawImage(img, rect[0], rect[1], rect[2], rect[3], (disObj.x || 0), (disObj.y || 0), (disObj.width || rect[2]), (disObj.height || rect[3]));
				}
			} else {
				elem.style.opacity = disObj.alpha != undefined ? disObj.alpha : 1;
				elem.style.overflow = "hidden";
				if (img && img.src) {
					elem.style.backgroundImage = "url(" + img.src + ")";
					var bgX = disObj.rectX || 0,
						bgY = disObj.rectY || 0;
					elem.style.backgroundPosition = (-bgX) + "px " + (-bgY) + "px";
				}
			}
			return elem;
		};

		/**
		 * 角度转弧度常量。
		 */
		Quark.DEG_TO_RAD = Math.PI / 180;

		/**
		 * 弧度转角度常量。
		 */
		Quark.RAD_TO_DEG = 180 / Math.PI;

		/**
		 * 检测显示对象obj是否与点x，y发生了碰撞。
		 * @param {DisplayObject} obj 要检测的显示对象。
		 * @param {Number} x 指定碰撞点的x坐标。
		 * @param {Number} y 指定碰撞点的y坐标。
		 * @param {Boolean} usePolyCollision 指定是否采用多边形碰撞。默认为false。
		 * @return {Number} 如果点x，y在对象obj内为1，在外为-1，在边上为0。
		 */
		Quark.hitTestPoint = function(obj, x, y, usePolyCollision) {
			var b = obj.getBounds(),
				len = b.length;
			var hit = x >= b.x && x <= b.x + b.width && y >= b.y && y <= b.y + b.height;

			if (hit && usePolyCollision) {
				var cross = 0,
					onBorder = false,
					minX, maxX, minY, maxY;
				for (var i = 0; i < len; i++) {
					var p1 = b[i],
						p2 = b[(i + 1) % len];

					if (p1.y == p2.y && y == p1.y) {
						p1.x > p2.x ? (minX = p2.x, maxX = p1.x) : (minX = p1.x, maxX = p2.x);
						if (x >= minX && x <= maxX) {
							onBorder = true;
							continue;
						}
					}

					p1.y > p2.y ? (minY = p2.y, maxY = p1.y) : (minY = p1.y, maxY = p2.y);
					if (y < minY || y > maxY) continue;

					var nx = (y - p1.y) * (p2.x - p1.x) / (p2.y - p1.y) + p1.x;
					if (nx > x) cross++;
					else if (nx == x) onBorder = true;
				}

				if (onBorder) return 0;
				else if (cross % 2 == 1) return 1;
				return -1;
			}
			return hit ? 1 : -1;
		};

		/**
		 * 检测显示对象obj1和obj2是否发生了碰撞。
		 * @param {DisplayObject} obj1 要检测的显示对象。
		 * @param {DisplayObject} obj2 要检测的显示对象。
		 * @param {Boolean} usePolyCollision 指定是否采用多边形碰撞。默认为false。
		 * @return {Boolean} 发生碰撞为true，否则为false。
		 */
		Quark.hitTestObject = function(obj1, obj2, usePolyCollision) {
			var b1 = obj1.getBounds(),
				b2 = obj2.getBounds();
			var hit = b1.x <= b2.x + b2.width && b2.x <= b1.x + b1.width &&
				b1.y <= b2.y + b2.height && b2.y <= b1.y + b1.height;

			if (hit && usePolyCollision) {
				hit = Quark.polygonCollision(b2, b2);
				return hit !== false;
			}
			return hit;
		};

		/**
		 * 采用Separating Axis Theorem(SAT)的多边形碰撞检测方法。
		 * @private
		 * @param {Array} poly1 多边形顶点组成的数组。格式如：[{x:0, y:0}, {x:10, y:0}, {x:10, y:10}, {x:0, y:10}]。
		 * @param {Array} poly2 多边形顶点组成的数组。格式与参数poly1相同。
		 * @param {Boolean} 发生碰撞为true，否则为false。
		 */
		Quark.polygonCollision = function(poly1, poly2) {
			var result = doSATCheck(poly1, poly2, {
				overlap: -Infinity,
				normal: {
					x: 0,
					y: 0
				}
			});
			if (result) return doSATCheck(poly2, poly1, result);
			return false;
		};

		function doSATCheck(poly1, poly2, result) {
			var len1 = poly1.length,
				len2 = poly2.length,
				currentPoint, nextPoint, distance, min1, max1, min2, max2, dot, overlap, normal = {
					x: 0,
					y: 0
				};

			for (var i = 0; i < len1; i++) {
				currentPoint = poly1[i];
				nextPoint = poly1[(i < len1 - 1 ? i + 1 : 0)];

				normal.x = currentPoint.y - nextPoint.y;
				normal.y = nextPoint.x - currentPoint.x;

				distance = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
				normal.x /= distance;
				normal.y /= distance;

				min1 = max1 = poly1[0].x * normal.x + poly1[0].y * normal.y;
				for (var j = 1; j < len1; j++) {
					dot = poly1[j].x * normal.x + poly1[j].y * normal.y;
					if (dot > max1) max1 = dot;
					else if (dot < min1) min1 = dot;
				}

				min2 = max2 = poly2[0].x * normal.x + poly2[0].y * normal.y;
				for (j = 1; j < len2; j++) {
					dot = poly2[j].x * normal.x + poly2[j].y * normal.y;
					if (dot > max2) max2 = dot;
					else if (dot < min2) min2 = dot;
				}

				if (min1 < min2) {
					overlap = min2 - max1;
					normal.x = -normal.x;
					normal.y = -normal.y;
				} else {
					overlap = min1 - max2;
				}

				if (overlap >= 0) {
					return false;
				} else if (overlap > result.overlap) {
					result.overlap = overlap;
					result.normal.x = normal.x;
					result.normal.y = normal.y;
				}
			}

			return result;
		};

		/**
		 * 返回Quark的字符串表示形式。
		 * @return {String} Quark的字符串表示形式。
		 */
		Quark.toString = function() {
			return "Quark";
		};

		/**
		 * 简单的log方法，同console.log作用相同。
		 */
		Quark.trace = function() {
			var logs = Array.prototype.slice.call(arguments);
			if (typeof(console) != "undefined" && typeof(console.log) != "undefined") console.log(logs.join(" "));
		};

		/**
		 * 默认的全局namespace为Quark或Q（当Q没有被占据的情况下）。
		 */
		if (win.Q == undefined) win.Q = Quark;
		if (win.trace == undefined) win.trace = Quark.trace;

	})(window);



	(function() {

		var Matrix = Quark.Matrix = function(a, b, c, d, tx, ty) {
			this.a = a;
			this.b = b;
			this.c = c;
			this.d = d;
			this.tx = tx;
			this.ty = ty;
		};

		Matrix.prototype.concat = function(mtx) {
			var a = this.a;
			var c = this.c;
			var tx = this.tx;

			this.a = a * mtx.a + this.b * mtx.c;
			this.b = a * mtx.b + this.b * mtx.d;
			this.c = c * mtx.a + this.d * mtx.c;
			this.d = c * mtx.b + this.d * mtx.d;
			this.tx = tx * mtx.a + this.ty * mtx.c + mtx.tx;
			this.ty = tx * mtx.b + this.ty * mtx.d + mtx.ty;
			return this;
		};

		Matrix.prototype.rotate = function(angle) {
			var cos = Math.cos(angle);
			var sin = Math.sin(angle);

			var a = this.a;
			var c = this.c;
			var tx = this.tx;

			this.a = a * cos - this.b * sin;
			this.b = a * sin + this.b * cos;
			this.c = c * cos - this.d * sin;
			this.d = c * sin + this.d * cos;
			this.tx = tx * cos - this.ty * sin;
			this.ty = tx * sin + this.ty * cos;
			return this;
		};

		Matrix.prototype.scale = function(sx, sy) {
			this.a *= sx;
			this.d *= sy;
			this.tx *= sx;
			this.ty *= sy;
			return this;
		};

		Matrix.prototype.translate = function(dx, dy) {
			this.tx += dx;
			this.ty += dy;
			return this;
		};

		Matrix.prototype.identity = function() {
			this.a = this.d = 1;
			this.b = this.c = this.tx = this.ty = 0;
			return this;
		};

		Matrix.prototype.invert = function() {
			var a = this.a;
			var b = this.b;
			var c = this.c;
			var d = this.d;
			var tx = this.tx;
			var i = a * d - b * c;

			this.a = d / i;
			this.b = -b / i;
			this.c = -c / i;
			this.d = a / i;
			this.tx = (c * this.ty - d * tx) / i;
			this.ty = -(a * this.ty - b * tx) / i;
			return this;
		};

		Matrix.prototype.transformPoint = function(point, round, returnNew) {
			var x = point.x * this.a + point.y * this.c + this.tx;
			var y = point.x * this.b + point.y * this.d + this.ty;
			if (round) {
				x = x + 0.5 >> 0;
				y = y + 0.5 >> 0;
			}
			if (returnNew) return {
				x: x,
				y: y
			};
			point.x = x;
			point.y = y;
			return point;
		};

		Matrix.prototype.clone = function() {
			return new Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty);
		};

		Matrix.prototype.toString = function() {
			return "(a=" + this.a + ", b=" + this.b + ", c=" + this.c + ", d=" + this.d + ", tx=" + this.tx + ", ty=" + this.ty + ")";
		};

	})();



	(function() {

		var Rectangle = Quark.Rectangle = function(x, y, width, height) {
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
		};

		Rectangle.prototype.intersects = function(rect) {
			return (this.x <= rect.x + rect.width && rect.x <= this.x + this.width &&
				this.y <= rect.y + rect.height && rect.y <= this.y + this.height);
		};

		Rectangle.prototype.intersection = function(rect) {
			var x0 = Math.max(this.x, rect.x);
			var x1 = Math.min(this.x + this.width, rect.x + rect.width);

			if (x0 <= x1) {
				var y0 = Math.max(this.y, rect.y);
				var y1 = Math.min(this.y + this.height, rect.y + rect.height);

				if (y0 <= y1) {
					return new Rectangle(x0, y0, x1 - x0, y1 - y0);
				}
			}
			return null;
		};

		Rectangle.prototype.union = function(rect, returnNew) {
			var right = Math.max(this.x + this.width, rect.x + rect.width);
			var bottom = Math.max(this.y + this.height, rect.y + rect.height);

			var x = Math.min(this.x, rect.x);
			var y = Math.min(this.y, rect.y);
			var width = right - x;
			var height = bottom - y;
			if (returnNew) {
				return new Rectangle(x, y, width, height);
			} else {
				this.x = x;
				this.y = y;
				this.width = width;
				this.height = height;
			}
		};

		Rectangle.prototype.containsPoint = function(x, y) {
			return (this.x <= x && x <= this.x + this.width && this.y <= y && y <= this.y + this.height);
		};

		Rectangle.prototype.clone = function() {
			return new Rectangle(this.x, this.y, this.width, this.height);
		};

		Rectangle.prototype.toString = function() {
			return "(x=" + this.x + ", y=" + this.y + ", width=" + this.width + ", height=" + this.height + ")";
		};

	})();



	(function() {

		/**
		 * 按钮Key的code映射表。
		 */
		Quark.KEY = {

			MOUSE_LEFT: 1,
			MOUSE_MID: 2,
			MOUSE_RIGHT: 3,

			BACKSPACE: 8,
			TAB: 9,
			NUM_CENTER: 12,
			ENTER: 13,
			RETURN: 13,
			SHIFT: 16,
			CTRL: 17,
			ALT: 18,
			PAUSE: 19,
			CAPS_LOCK: 20,
			ESC: 27,
			ESCAPE: 27,
			SPACE: 32,
			PAGE_UP: 33,
			PAGE_DOWN: 34,
			END: 35,
			HOME: 36,
			LEFT: 37,
			UP: 38,
			RIGHT: 39,
			DOWN: 40,
			PRINT_SCREEN: 44,
			INSERT: 45,
			DELETE: 46,

			ZERO: 48,
			ONE: 49,
			TWO: 50,
			THREE: 51,
			FOUR: 52,
			FIVE: 53,
			SIX: 54,
			SEVEN: 55,
			EIGHT: 56,
			NINE: 57,

			A: 65,
			B: 66,
			C: 67,
			D: 68,
			E: 69,
			F: 70,
			G: 71,
			H: 72,
			I: 73,
			J: 74,
			K: 75,
			L: 76,
			M: 77,
			N: 78,
			O: 79,
			P: 80,
			Q: 81,
			R: 82,
			S: 83,
			T: 84,
			U: 85,
			V: 86,
			W: 87,
			X: 88,
			Y: 89,
			Z: 90,

			CONTEXT_MENU: 93,
			NUM_ZERO: 96,
			NUM_ONE: 97,
			NUM_TWO: 98,
			NUM_THREE: 99,
			NUM_FOUR: 100,
			NUM_FIVE: 101,
			NUM_SIX: 102,
			NUM_SEVEN: 103,
			NUM_EIGHT: 104,
			NUM_NINE: 105,
			NUM_MULTIPLY: 106,
			NUM_PLUS: 107,
			NUM_MINUS: 109,
			NUM_PERIOD: 110,
			NUM_DIVISION: 111,
			F1: 112,
			F2: 113,
			F3: 114,
			F4: 115,
			F5: 116,
			F6: 117,
			F7: 118,
			F8: 119,
			F9: 120,
			F10: 121,
			F11: 122,
			F12: 123
		};

	})();



	(function() {

		/**
		 * 构造函数.
		 * @name EventManager
		 * @class EventManager是一个简单的系统事件管理器。
		 */
		var EventManager = Quark.EventManager = function() {
			this.keyState = {};
			this._evtHandlers = {};
		};

		/**
		 * 注册Quark.Stage事件侦听，使得Stage能够接收和处理指定的事件。
		 * @param stage Quark.Stage舞台对象。
		 * @param events 要注册的事件类型数组。
		 */
		EventManager.prototype.registerStage = function(stage, events, preventDefault, stopPropagation) {
			this.register(stage.context.canvas, events, {
				host: stage,
				func: stage.dispatchEvent
			}, preventDefault, stopPropagation);
		};

		/**
		 * 删除Quark.Stage事件侦听。
		 * @param stage Quark.Stage舞台对象。
		 * @param events 要删除的事件类型数组。
		 */
		EventManager.prototype.unregisterStage = function(stage, events) {
			this.unregister(stage.context.canvas, events, stage.dispatchEvent);
		};

		/**
		 * 注册DOM事件侦听，当事件触发时调用callback函数。
		 * @param target 事件目标DOM对象。
		 * @param events 要注册事件类型数组。
		 */
		EventManager.prototype.register = function(target, events, callback, preventDefault, stopPropagation) {
			if (callback == null || (typeof callback == "function")) callback = {
				host: null,
				func: callback
			};
			var params = {
				prevent: preventDefault,
				stop: stopPropagation
			};

			var me = this,
				handler = function(e) {
					me._onEvent(e, params, callback);
				};

			for (var i = 0; i < events.length; i++) {
				var type = events[i],
					list = this._evtHandlers[type] || (this._evtHandlers[type] = []);
				for (var j = 0, has = false; j < list.length; j++) {
					var li = list[j];
					if (li.target == target && li.callback.func == callback.func) {
						trace("duplicate callback");
						has = true;
						break;
					}
				}
				if (!has) {
					list.push({
						target: target,
						callback: callback,
						handler: handler
					});
					target.addEventListener(type, handler, false);
				}
			}
		};

		/**
		 * 删除对象事件侦听。
		 * @param target 事件目标DOM对象。
		 * @param events 要删除的事件类型数组。
		 */
		EventManager.prototype.unregister = function(target, events, callback) {
			for (var i = 0; i < events.length; i++) {
				var type = events[i],
					list = this._evtHandlers[type];
				for (var j = 0; j < list.length; j++) {
					var li = list[j];
					if (li.target == target && (li.callback.func == callback || callback == null)) {
						target.removeEventListener(type, li.handler);
						list.splice(j, 1);
						break;
					}
				}
			}
		};

		/**
		 * 内部事件处理器。
		 * @private
		 */
		EventManager.prototype._onEvent = function(e, params, callback) {
			//correct touch events
			var ne = e,
				type = e.type,
				isTouch = e.type.indexOf("touch") == 0;
			if (isTouch) {
				ne = (e.touches && e.touches.length > 0) ? e.touches[0] :
					(e.changedTouches && e.changedTouches.length > 0) ? e.changedTouches[0] : e;
				ne.type = type;
				ne.rawEvent = e;
			}

			if (type == "keydown" || type == "keyup" || type == "keypress") {
				this.keyState[e.keyCode] = type;
			}

			//e.eventTime = Date.now();

			if (callback.func != null) callback.func.call(callback.host, ne);

			EventManager.stop(e, !params.prevent, !params.stop);
		};

		/**
		 * 停止事件。
		 * @param e 要停止的事件对象。
		 * @param continueDefault 是否继续事件的默认行为。
		 * @param continuePropagation 是否继续事件的冒泡。
		 */
		EventManager.stop = function(e, continueDefault, continuePropagation) {
			if (!continueDefault) e.preventDefault();
			if (!continuePropagation) {
				e.stopPropagation();
				if (e.stopImmediatePropagation) e.stopImmediatePropagation();
			}
		};

	})();



	(function() {

		/**
		 * 构造函数.
		 * @name EventDispatcher
		 * @class EventDispatcher类是可调度事件的类的基类，它允许显示列表上的任何对象都是一个事件目标。
		 */
		var EventDispatcher = Quark.EventDispatcher = function() {
			//事件映射表，格式为：{type1:[listener1, listener2], type2:[listener3, listener4]}
			this._eventMap = {};
		};

		/**
		 * 注册事件侦听器对象，以使侦听器能够接收事件通知。
		 */
		EventDispatcher.prototype.addEventListener = function(type, listener) {
			var map = this._eventMap[type];
			if (map == null) map = this._eventMap[type] = [];

			if (map.indexOf(listener) == -1) {
				map.push(listener);
				return true;
			}
			return false;
		};

		/**
		 * 删除事件侦听器。
		 */
		EventDispatcher.prototype.removeEventListener = function(type, listener) {
			if (arguments.length == 1) return this.removeEventListenerByType(type);

			var map = this._eventMap[type];
			if (map == null) return false;

			for (var i = 0; i < map.length; i++) {
				var li = map[i];
				if (li === listener) {
					map.splice(i, 1);
					if (map.length == 0) delete this._eventMap[type];
					return true;
				}
			}
			return false;
		};

		/**
		 * 删除指定类型的所有事件侦听器。
		 */
		EventDispatcher.prototype.removeEventListenerByType = function(type) {
			var map = this._eventMap[type];
			if (map != null) {
				delete this._eventMap[type];
				return true;
			}
			return false;
		};

		/**
		 * 删除所有事件侦听器。
		 */
		EventDispatcher.prototype.removeAllEventListeners = function() {
			this._eventMap = {};
		};

		/**
		 * 派发事件，调用事件侦听器。
		 */
		EventDispatcher.prototype.dispatchEvent = function(event) {
			var map = this._eventMap[event.type];
			if (map == null) return false;
			if (!event.target) event.target = this;
			map = map.slice();

			for (var i = 0; i < map.length; i++) {
				var listener = map[i];
				if (typeof(listener) == "function") {
					listener.call(this, event);
				}
			}
			return true;
		};

		/**
		 * 检查是否为指定事件类型注册了任何侦听器。
		 */
		EventDispatcher.prototype.hasEventListener = function(type) {
			var map = this._eventMap[type];
			return map != null && map.length > 0;
		};

		//添加若干的常用的快捷缩写方法
		EventDispatcher.prototype.on = EventDispatcher.prototype.addEventListener;
		EventDispatcher.prototype.un = EventDispatcher.prototype.removeEventListener;
		EventDispatcher.prototype.fire = EventDispatcher.prototype.dispatchEvent;

	})();



	(function() {

		/**
		 * 构造函数.
		 * @name Context
		 * @class Context是Quark框架中显示对象结构的上下文，实现显示对象结构的渲染。此类为抽象类。
		 * @param {Object} props 一个对象。包含以下属性：
		 * <p>canvas - 渲染上下文所对应的画布。</p>
		 */
		var Context = Quark.Context = function(props) {
			if (props.canvas == null) throw "Quark.Context Error: canvas is required.";

			this.canvas = null;
			Quark.merge(this, props);
		};

		/**
		 * 为开始绘制显示对象做准备，需要子类来实现。
		 */
		Context.prototype.startDraw = function() {};

		/**
		 * 绘制显示对象，需要子类来实现。
		 */
		Context.prototype.draw = function() {};

		/**
		 * 完成绘制显示对象后的处理方法，需要子类来实现。
		 */
		Context.prototype.endDraw = function() {};

		/**
		 * 对显示对象进行变换，需要子类来实现。
		 */
		Context.prototype.transform = function() {};

		/**
		 * 从画布中删除显示对象，需要子类来实现。
		 * @param {DisplayObject} target 要删除的显示对象。
		 */
		Context.prototype.remove = function(target) {};

	})();



	(function() {

		/**
		 * 构造函数.
		 * @name CanvasContext
		 * @augments Context
		 * @class CanvasContext是Canvas渲染上下文，将显示对象渲染到指定的Canvas上。
		 * @param {Object} props 一个对象。包含以下属性：
		 * <p>canvas - 渲染上下文所对应的canvas，HTMLCanvasElement对象。</p>
		 */
		var CanvasContext = Quark.CanvasContext = function(props) {
			CanvasContext.superClass.constructor.call(this, props);
			this.context = this.canvas.getContext("2d");
		};
		Quark.inherit(CanvasContext, Quark.Context);

		/**
		 * 准备绘制，保存当前上下文。
		 */
		CanvasContext.prototype.startDraw = function() {
			this.context.save();
		};

		/**
		 * 绘制指定的显示对象到Canvas上。
		 * @param {DisplayObject} target 要绘制的显示对象。
		 */
		CanvasContext.prototype.draw = function(target) {
			//ignore children drawing if the parent has a mask.
			if (target.parent != null && target.parent.mask != null) return;

			if (target.mask != null) {
				//we implements the mask function by using 'source-in' composite operation.
				//so can't draw objects with masks into this canvas directly.
				var w = target.width,
					h = target.height;
				var context = Q._helpContext,
					canvas = context.canvas,
					ctx = context.context;
				canvas.width = 0;
				canvas.width = w;
				canvas.height = h;
				context.startDraw();
				target.mask._render(context);
				ctx.globalCompositeOperation = 'source-in';

				//this is a trick for ignoring mask drawing during object drawing.
				var mask = target.mask;
				target.mask = null;
				if (target instanceof Quark.DisplayObjectContainer) {
					//container's children should draw at once in 'source-in' mode.
					var cache = target._cache || Quark.cacheObject(target);
					ctx.drawImage(cache, 0, 0, w, h, 0, 0, w, h);
				} else {
					target.render(context);
				}
				context.endDraw();
				target.mask = mask;

				arguments[0] = canvas;
				this.context.drawImage.apply(this.context, arguments);
			} else if (target._cache != null) {
				//draw cache if exist
				this.context.drawImage(target._cache, 0, 0);
			} else if (target instanceof Quark.Graphics || target instanceof Quark.Text) {
				//special drawing
				target._draw(this.context);
			} else {
				//normal draw
				var img = target.getDrawable(this);
				if (img != null) {
					arguments[0] = img;
					this.context.drawImage.apply(this.context, arguments);
				}
			}
		};

		/**
		 * 绘制完毕，恢复上下文。
		 */
		CanvasContext.prototype.endDraw = function() {
			this.context.restore();
		};

		/**
		 * 对指定的显示对象进行context属性设置或变换。
		 * @param {DisplayObject} target 要进行属性设置或变换的显示对象。
		 */
		CanvasContext.prototype.transform = function(target) {
			var ctx = this.context;

			if (target instanceof Q.Stage) {
				//Use style for stage scaling
				if (target._scaleX != target.scaleX) {
					target._scaleX = target.scaleX;
					this.canvas.style.width = target._scaleX * target.width + "px";
				}
				if (target._scaleY != target.scaleY) {
					target._scaleY = target.scaleY;
					this.canvas.style.height = target._scaleY * target.height + "px";
				}
			} else {
				if (target.x != 0 || target.y != 0) ctx.translate(target.x, target.y);
				if (target.rotation % 360 != 0) ctx.rotate(target.rotation % 360 * Quark.DEG_TO_RAD);
				if (target.scaleX != 1 || target.scaleY != 1) ctx.scale(target.scaleX, target.scaleY);
				if (target.regX != 0 || target.regY != 0) ctx.translate(-target.regX, -target.regY);
			}

			if (target.alpha > 0) ctx.globalAlpha *= target.alpha;
		};

		/**
		 * 清除画布上的指定区域内容。
		 * @param {Number} x 指定区域的x轴坐标。
		 * @param {Number} y 指定区域的y轴坐标。
		 * @param {Number} width 指定区域的宽度。
		 * @param {Number} height 指定区域的高度。
		 */
		CanvasContext.prototype.clear = function(x, y, width, height) {
			this.context.clearRect(x, y, width, height);
			//this.canvas.width = this.canvas.width;
		};

	})();



	(function() {

		/**
		 * 检测浏览器是否支持transform或transform3D。
		 */
		var testElem = document.createElement("div");
		var supportTransform = testElem.style[Quark.cssPrefix + "Transform"] != undefined;
		var supportTransform3D = testElem.style[Quark.cssPrefix + "Perspective"] != undefined;
		var docElem = document.documentElement;
		if (supportTransform3D && 'webkitPerspective' in docElem.style) {
			testElem.id = 'test3d';
			var st = document.createElement('style');
			st.textContent = '@media (-webkit-transform-3d){#test3d{height:3px}}';
			document.head.appendChild(st);
			docElem.appendChild(testElem);

			supportTransform3D = testElem.offsetHeight === 3;

			st.parentNode.removeChild(st);
			testElem.parentNode.removeChild(testElem);
		};
		Quark.supportTransform = supportTransform;
		Quark.supportTransform3D = supportTransform3D;
		if (!supportTransform) {
			trace("Warn: DOMContext requires css transfrom support.");
			return;
		}

		/**
		 * 构造函数.
		 * @name DOMContext
		 * @augments Context
		 * @class DOMContext是DOM渲染上下文，将显示对象以dom方式渲染到舞台上。
		 * @param {Object} props 一个对象。包含以下属性：
		 * <p>canvas - 渲染上下文所对应的画布，HTMLDivElement对象。</p>
		 */
		var DOMContext = Quark.DOMContext = function(props) {
			DOMContext.superClass.constructor.call(this, props);
		};
		Quark.inherit(DOMContext, Quark.Context);

		/**
		 * 绘制指定对象的DOM到舞台上。
		 * @param {DisplayObject} target 要绘制的显示对象。
		 */
		DOMContext.prototype.draw = function(target) {
			if (!target._addedToDOM) {
				var parent = target.parent;
				var targetDOM = target.getDrawable(this);
				if (parent != null) {
					var parentDOM = parent.getDrawable(this);
					if (targetDOM.parentNode != parentDOM) parentDOM.appendChild(targetDOM);
					if (parentDOM.parentNode == null && parent instanceof Quark.Stage) {
						this.canvas.appendChild(parentDOM);
						parent._addedToDOM = true;
					}
					target._addedToDOM = true;
				}
			}
		};

		/**
		 * 对指定的显示对象的DOM进行css属性设置或变换。
		 * @param {DisplayObject} target 要进行属性设置或变换的显示对象。
		 */
		DOMContext.prototype.transform = function(target) {
			var image = target.getDrawable(this);
			//优化：可以对那些添加到DOM后就不再需要变换的显示对象设置transformEnabled=false。
			if (!target.transformEnabled && target._addedToDOM) return;

			var prefix = Quark.cssPrefix,
				origin = prefix + "TransformOrigin",
				transform = prefix + "Transform",
				style = image.style;

			if (!style.display || target.propChanged("visible", "alpha")) {
				style.display = (!target.visible || target.alpha <= 0) ? "none" : "";
			}
			if (!style.opacity || target.propChanged("alpha")) {
				style.opacity = target.alpha;
			}
			if (!style.backgroundPosition || target.propChanged("rectX", "rectY")) {
				style.backgroundPosition = (-target.rectX) + "px " + (-target.rectY) + "px";
			}
			if (!style.width || target.propChanged("width", "height")) {
				style.width = target.width + "px";
				style.height = target.height + "px";
			}
			if (!style[origin] || target.propChanged("regX", "regY")) {
				style[origin] = target.regX + "px " + target.regY + "px";
			}
			if (!style[transform] || target.propChanged("x", "y", "regX", "regY", "scaleX", "scaleY", "rotation")) {
				var css = Quark.supportTransform3D ? getTransformCSS(target, true) : getTransformCSS(target, false);
				style[transform] = css;
			}
			if (!style.zIndex || target.propChanged("_depth")) {
				style.zIndex = target._depth;
			}
			if (target.mask != null) {
				style[Q.cssPrefix + "MaskImage"] = target.mask.getDrawable(this).style.backgroundImage;
				style[Q.cssPrefix + "MaskRepeat"] = "no-repeat";
				style[Q.cssPrefix + "MaskPosition"] = target.mask.x + "px " + target.mask.y + "px";
			}
			style.pointerEvents = target.eventEnabled ? "auto" : "none";
		};

		/**
		 * 根据指定对象生成css变换的样式。
		 * @param {DisplayObject} target 显示对象。
		 * @param {Boolean} useTransform3D 是否采用transform—3d变换。在支持transform—3d的浏览器中推荐使用。默认为false。
		 * @return {String} 生成的css样式。
		 */
		function getTransformCSS(target, useTransform3D) {
			var css = "";

			if (useTransform3D) {
				css += "translate3d(" + (target.x - target.regX) + "px, " + (target.y - target.regY) + "px, 0px)" + "rotate3d(0, 0, 1, " + target.rotation + "deg)" + "scale3d(" + target.scaleX + ", " + target.scaleY + ", 1)";
			} else {
				css += "translate(" + (target.x - target.regX) + "px, " + (target.y - target.regY) + "px)" + "rotate(" + target.rotation + "deg)" + "scale(" + target.scaleX + ", " + target.scaleY + ")";
			}
			return css;
		};

		/**
		 * 隐藏指定对象渲染的dom节点，用于当显示对象visible=0或alpha=0等情况，由显示对象内部方法调用。
		 * @param {DisplayObject} target 要隐藏的显示对象。
		 */
		DOMContext.prototype.hide = function(target) {
			target.getDrawable(this).style.display = "none";
		};

		/**
		 * 删除指定显示对象渲染的dom节点，由显示对象内部方法调用。
		 * @param {DisplayObject} target 要删除的显示对象。
		 */
		DOMContext.prototype.remove = function(target) {
			var targetDOM = target.getDrawable(this);
			var parentNode = targetDOM.parentNode;
			if (parentNode != null) parentNode.removeChild(targetDOM);
			target._addedToDOM = false;
		};

	})();



	(function() {

		/**
		 * UIDUtil用来生成一个全局唯一的ID。
		 * @private
		 */
		var UIDUtil = Quark.UIDUtil = {
			_counter: 0
		};

		/**
		 * 根据指定名字生成一个全局唯一的ID，如Stage1，Bitmap2等。
		 */
		UIDUtil.createUID = function(name) {
			var charCode = name.charCodeAt(name.length - 1);
			if (charCode >= 48 && charCode <= 57) name += "_";
			return name + this._counter++;
		};

		/**
		 * 为指定的displayObject显示对象生成一个包含路径的字符串表示形式。如Stage1.Container2.Bitmap3。
		 */
		UIDUtil.displayObjectToString = function(displayObject) {
			var result;
			for (var o = displayObject; o != null; o = o.parent) {
				var s = o.id != null ? o.id : o.name;
				result = result == null ? s : (s + "." + result);
				if (o == o.parent) break;
			}
			return result;
		};

	})();



	(function() {

		/**
		 * 获取URL参数。
		 * @return {Object} 包含URL参数的键值对对象。
		 */
		Quark.getUrlParams = function() {
			var params = {};
			var url = window.location.href;
			var idx = url.indexOf("?");
			if (idx > 0) {
				var queryStr = url.substring(idx + 1);
				var args = queryStr.split("&");
				for (var i = 0, a, nv; a = args[i]; i++) {
					nv = args[i] = a.split("=");
					params[nv[0]] = nv.length > 1 ? nv[1] : true;
				}
			}
			return params;
		};

		var head = document.getElementsByTagName("head")[0];
		var metas = head.getElementsByTagName("meta");
		var metaAfterNode = metas.length > 0 ? metas[metas.length - 1].nextSibling : head.childNodes[0];

		/**
		 * 动态添加meta到head中。
		 * @param {Object} props 要添加的meta的属性. 格式如：{name:'viewport', content:'width=device-width'}。
		 */
		Quark.addMeta = function(props) {
			var meta = document.createElement("meta");
			for (var p in props) meta.setAttribute(p, props[p]);
			head.insertBefore(meta, metaAfterNode);
		};

		/**
		 * 显示或关闭舞台上所有显示对象的外包围矩形。此方法主要用于调试物体碰撞区域等。
		 * @param {Stage} stage 要调试的舞台对象。
		 */
		Quark.toggleDebugRect = function(stage) {
			stage.debug = !stage.debug;
			if (stage.debug) {
				stage._render = function(context) {
					if (context.clear != null) context.clear(0, 0, stage.width, stage.height);
					Quark.Stage.superClass._render.call(stage, context);

					var ctx = stage.context.context;
					if (ctx != null) {
						ctx.save();
						ctx.lineWidth = 1;
						ctx.strokeStyle = "#f00";
						ctx.globalAlpha = 0.5;
					}
					drawObjectRect(stage, ctx);
					if (ctx != null) ctx.restore();
				};
			} else {
				stage._render = function(context) {
					if (context.clear != null) context.clear(0, 0, stage.width, stage.height);
					Quark.Stage.superClass._render.call(stage, context);
				};
			}
		};

		/**
		 * 绘制显示对象的外包围矩形。
		 * @private
		 */
		function drawObjectRect(obj, ctx) {
			for (var i = 0; i < obj.children.length; i++) {
				var child = obj.children[i];
				if (child.children) {
					drawObjectRect(child, ctx);
				} else {
					if (ctx != null) {
						var b = child.getBounds();

						ctx.globalAlpha = 0.2;
						ctx.beginPath();
						var p0 = b[0];
						ctx.moveTo(p0.x - 0.5, p0.y - 0.5);
						for (var j = 1; j < b.length; j++) {
							var p = b[j];
							ctx.lineTo(p.x - 0.5, p.y - 0.5);
						}
						ctx.lineTo(p0.x - 0.5, p0.y - 0.5);
						ctx.stroke();
						ctx.closePath();
						ctx.globalAlpha = 0.5;

						ctx.beginPath();
						ctx.rect((b.x >> 0) - 0.5, (b.y >> 0) - 0.5, b.width >> 0, b.height >> 0);
						ctx.stroke();
						ctx.closePath();
					} else {
						if (child.drawable.domDrawable) child.drawable.domDrawable.style.border = "1px solid #f00";
					}
				}
			}
		};

		/**
		 * 把DisplayObject对象绘制到一个新的画布上。可作为缓存使用，也可转换成dataURL格式的位图。
		 * @param {DisplayObject} obj 要缓存的显示对象。
		 * @param {Boolean} toImage 指定是否把缓存转为DataURL格式的。默认为false。
		 * @param {String} type 指定转换为DataURL格式的图片mime类型。默认为"image/png"。
		 * @return {Object} 显示对象的缓存结果。根据参数toImage不同而返回Canvas或Image对象。
		 */
		Quark.cacheObject = function(obj, toImage, type) {
			var w = obj.width,
				h = obj.height,
				mask = obj.mask;
			var canvas = Quark.createDOM("canvas", {
				width: w,
				height: h
			});
			var context = new Quark.CanvasContext({
				canvas: canvas
			});
			obj.mask = null;
			obj.render(context);
			obj.mask = mask;

			if (toImage) {
				var img = new Image();
				img.width = w;
				img.height = h;
				img.src = canvas.toDataURL(type || "image/png");
				return img;
			}
			return canvas;
		};


		/**
		 * 用于Quark内部实现的一个上下文。
		 * @private
		 */
		Quark._helpContext = new Quark.CanvasContext({
			canvas: Quark.createDOM("canvas")
		});

	})();



	(function() {

		/**
		 * 构造函数.
		 * @name Timer
		 * @class Timer是一个计时器。它能按指定的时间序列运行代码。
		 * @param interval 计时器的时间间隔。以毫秒为单位。
		 */
		var Timer = Quark.Timer = function(interval) {
			this.interval = interval || 50;
			this.paused = false;
			this.info = {
				lastTime: 0,
				currentTime: 0,
				deltaTime: 0,
				realDeltaTime: 0
			};

			this._startTime = 0;
			this._intervalID = null;
			this._listeners = [];
		};

		/**
		 * 启动计时器。
		 */
		Timer.prototype.start = function() {
			if (this._intervalID != null) return;
			this._startTime = this.info.lastTime = this.info.currentTime = Date.now();
			var me = this;
			var run = function() {
				me._intervalID = setTimeout(run, me.interval);
				me._run();
			};
			run();
		};

		/**
		 * 停止计时器。
		 */
		Timer.prototype.stop = function() {
			clearTimeout(this._intervalID);
			this._intervalID = null;
			this._startTime = 0;
		};

		/**
		 * 暂停计时器。
		 */
		Timer.prototype.pause = function() {
			this.paused = true;
		};

		/**
		 * 恢复计时器。
		 */
		Timer.prototype.resume = function() {
			this.paused = false;
		};

		/**
		 * 计时器的运行回调。当达到执行条件时，调用所有侦听器的step方法。
		 * @private
		 */
		Timer.prototype._run = function() {
			if (this.paused) return;

			var info = this.info;
			var time = info.currentTime = Date.now();
			info.deltaTime = info.realDeltaTime = time - info.lastTime;

			for (var i = 0, len = this._listeners.length, obj, runTime; i < len; i++) {
				obj = this._listeners[i];
				runTime = obj.__runTime || 0;
				if (runTime == 0) {
					obj.step(this.info);
				} else if (time > runTime) {
					obj.step(this.info);
					this._listeners.splice(i, 1);
					i--;
					len--;
				}
			}

			info.lastTime = time;
		};

		/**
		 * 延迟一定时间time调用callback方法。
		 * @param callback 调用的方法。
		 * @param time 延迟的时间，以毫秒为单位。
		 */
		Timer.prototype.delay = function(callback, time) {
			var obj = {
				step: callback,
				__runTime: Date.now() + time
			};
			this.addListener(obj);
		};

		/**
		 * 添加侦听器对象，计时器会按照指定的时间间隔来调用侦听器的step方法。即listner必需有step方法。
		 * @param obj 侦听器对象。
		 **/
		Timer.prototype.addListener = function(obj) {
			if (obj == null || typeof(obj.step) != "function") throw "Timer Error: The listener object must implement a step() method!";
			this._listeners.push(obj);
		};

		/**
		 * 删除侦听器。
		 */
		Timer.prototype.removeListener = function(obj) {
			var index = this._listeners.indexOf(obj);
			if (index > -1) {
				this._listeners.splice(index, 1);
			}
		};

	})();



	(function() {

		/**
		 * 构造函数.
		 * @name ImageLoader
		 * @augments EventDispatcher
		 * @class ImageLoader类是一个图片加载器，用于动态加载图片资源。
		 * @param source 要加载的图片资源，可以是一个单独资源或多个资源的数组。图片资源格式为：{src:$url, id:$id, size:$size}。
		 */
		var ImageLoader = Quark.ImageLoader = function(source) {
			ImageLoader.superClass.constructor.call(this);

			this.loading = false; //ready-only

			this._index = -1;
			this._loaded = 0;
			this._images = {};
			this._totalSize = 0;
			this._loadHandler = Quark.delegate(this._loadHandler, this);

			this._addSource(source);
		};
		Quark.inherit(ImageLoader, Quark.EventDispatcher);

		/**
		 * 开始顺序加载图片资源。
		 * @param source 要加载的图片资源，可以是一个单独资源或多个资源的数组。
		 */
		ImageLoader.prototype.load = function(source) {
			this._addSource(source);
			if (!this.loading) this._loadNext();
		};

		/**
		 * 添加图片资源。
		 * @private
		 */
		ImageLoader.prototype._addSource = function(source) {
			if (!source) return;
			source = (source instanceof Array) ? source : [source];
			for (var i = 0; i < source.length; i++) {
				this._totalSize += source[i].size || 0;
			}
			if (!this._source) this._source = source;
			else this._source = this._source.concat(source);
		};

		/**
		 * 加载下一个图片资源。
		 * @private
		 */
		ImageLoader.prototype._loadNext = function() {
			this._index++;
			if (this._index >= this._source.length) {
				this.dispatchEvent({
					type: "complete",
					target: this,
					images: this._images
				});
				this._source = [];
				this.loading = false;
				this._index = -1;
				return;
			}

			var img = new Image();
			img.onload = this._loadHandler;
			img.src = this._source[this._index].src;
			this.loading = true;
		};

		/**
		 * 图片加载处理器。
		 * @private
		 */
		ImageLoader.prototype._loadHandler = function(e) {
			this._loaded++;
			var image = this._source[this._index];
			image.image = e.target;
			var id = image.id || image.src;
			this._images[id] = image;
			this.dispatchEvent({
				type: "loaded",
				target: this,
				image: image
			});
			this._loadNext();
		};

		/**
		 * 返回已加载图片资源的数目。
		 */
		ImageLoader.prototype.getLoaded = function() {
			return this._loaded;
		};

		/**
		 * 返回所有图片资源的总数。
		 */
		ImageLoader.prototype.getTotal = function() {
			return this._source.length;
		};

		/**
		 * 返回已加载的图片资源的大小之和（在图片资源的大小size已指定的情况下）。
		 */
		ImageLoader.prototype.getLoadedSize = function() {
			var size = 0;
			for (var id in this._images) {
				var item = this._images[id];
				size += item.size || 0;
			}
			return size;
		};

		/**
		 * 返回所有图片资源的大小之和（在图片资源的大小size已指定的情况下）。
		 */
		ImageLoader.prototype.getTotalSize = function() {
			return this._totalSize;
		};

	})();



	(function() {

		/**
		 * 构造函数.
		 * @name Tween
		 * @class Tween类是一个缓动动画类。使用它能实现移动、改变大小、淡入淡出等效果。
		 * @param target 实现缓动动画的目标对象。
		 * @param newProps 设置目标对象的新的属性。
		 * @param params 设置缓动动画类的参数。
		 */
		var Tween = Quark.Tween = function(target, newProps, params) {
			this.target = target;
			this.time = 0;
			this.delay = 0;
			this.paused = false;
			this.loop = false;
			this.reverse = false;
			this.interval = 0;
			this.ease = Easing.Linear.EaseNone;
			this.next = null;

			this.onStart = null;
			this.onUpdate = null;
			this.onComplete = null;

			this._oldProps = {};
			this._newProps = {};
			this._deltaProps = {};
			this._startTime = 0;
			this._lastTime = 0;
			this._pausedTime = 0;
			this._pausedStartTime = 0;
			this._reverseFlag = 1;
			this._frameTotal = 0;
			this._frameCount = 0;

			for (var p in newProps) {
				var oldVal = target[p],
					newVal = newProps[p];
				if (oldVal !== undefined) {
					if (typeof(oldVal) == "number" && typeof(newVal) == "number") {
						this._oldProps[p] = oldVal;
						this._newProps[p] = newVal;
						this._deltaProps[p] = newVal - oldVal;
					}
				}
			}

			for (var p in params) {
				this[p] = params[p];
			}
		};

		/**
		 * 设置缓动对象的初始和目标属性。
		 * @param oldProps 缓动对象的初始属性。
		 * @param newProps 缓动对象的目标属性。
		 */
		Tween.prototype.setProps = function(oldProps, newProps) {
			for (var p in oldProps) {
				this.target[p] = this._oldProps[p] = oldProps[p];
			}
			for (var p in newProps) {
				this._newProps[p] = newProps[p];
				this._deltaProps[p] = newProps[p] - this.target[p];
			}
		};

		/**
		 * 初始化Tween类。
		 * @private
		 */
		Tween.prototype._init = function() {
			this._startTime = Date.now() + this.delay;
			this._pausedTime = 0;
			if (this.interval > 0) this._frameTotal = Math.round(this.time / this.interval);
			Tween.add(this);
		};

		/**
		 * 启动缓动动画的播放。
		 */
		Tween.prototype.start = function() {
			this._init();
			this.paused = false;
		};

		/**
		 * 停止缓动动画的播放。
		 */
		Tween.prototype.stop = function() {
			Tween.remove(this);
		};

		/**
		 * 暂停缓动动画的播放。
		 */
		Tween.prototype.pause = function() {
			this.paused = true;
			this._pausedStartTime = Date.now();
		};

		/**
		 * 恢复缓动动画的播放。
		 */
		Tween.prototype.resume = function() {
			this.paused = false;
			this._pausedTime += Date.now() - this._pausedStartTime;
		};

		/**
		 * Tween类的内部更新方法。
		 * @private
		 */
		Tween.prototype._update = function() {
			if (this.paused) return;
			var now = Date.now();
			var elapsed = now - this._startTime - this._pausedTime;
			if (elapsed < 0) return;

			if (this._lastTime == 0 && this.onStart != null) this.onStart(this);
			this._lastTime = now;

			var ratio = this._frameTotal > 0 ? (++this._frameCount / this._frameTotal) : (elapsed / this.time);
			if (ratio > 1) ratio = 1;
			var value = this.ease(ratio);

			for (var p in this._oldProps) {
				this.target[p] = this._oldProps[p] + this._deltaProps[p] * this._reverseFlag * value;
			}

			if (this.onUpdate != null) this.onUpdate(this, value);

			if (ratio >= 1) {
				if (this.reverse) {
					var tmp = this._oldProps;
					this._oldProps = this._newProps;
					this._newProps = tmp;
					this._startTime = Date.now();
					this._frameCount = 0;
					this._reverseFlag *= -1;
					if (!this.loop) this.reverse = false;
				} else if (this.loop) {
					for (var p in this._oldProps) this.target[p] = this._oldProps[p];
					this._startTime = Date.now();
					this._frameCount = 0;
				} else {
					Tween.remove(this);
					var next = this.next,
						nextTween;
					if (next != null) {
						if (next instanceof Tween) {
							nextTween = next;
							next = null;
						} else {
							nextTween = next.shift();
						}
						if (nextTween != null) {
							nextTween.next = next;
							nextTween.start();
						}
					}
				}
				if (this.onComplete != null) this.onComplete(this);
			}
		};

		/**
		 * 保存所有Tween类的实例。
		 * @static
		 */
		Tween._tweens = [];

		/**
		 * 更新所有Tween实例，一般由Quark.Timer类自动调用。
		 * @static
		 */
		Tween.step = function() {
			var tweens = this._tweens,
				i = tweens.length;
			while (--i >= 0) tweens[i]._update();
		};

		/**
		 * 添加Tween实例。
		 * @static
		 */
		Tween.add = function(tween) {
			if (this._tweens.indexOf(tween) == -1) this._tweens.push(tween);
			return this;
		};

		/**
		 * 删除Tween实例。
		 * @staitc
		 */
		Tween.remove = function(tween) {
			var tweens = this._tweens,
				index = tweens.indexOf(tween);
			if (index > -1) tweens.splice(index, 1);
			return this;
		};

		/**
		 * 创建一个缓动动画，让目标对象从当前属性变换到目标属性。
		 * @param target 缓动目标对象
		 * @param toProps 缓动目标对象的目标属性。
		 * @param params 缓动动画的参数。
		 */
		Tween.to = function(target, toProps, params) {
			var tween = new Tween(target, toProps, params);
			tween._init();
			return tween;
		};

		/**
		 * 创建一个缓动动画，让目标对象从指定的起始属性变换到当前属性。
		 * @param target 缓动目标对象
		 * @param toProps 缓动目标对象的起始属性。
		 * @param params 缓动动画的参数。
		 */
		Tween.from = function(target, fromProps, params) {
			var tween = new Tween(target, fromProps, params);
			var tmp = tween._oldProps;
			tween._oldProps = tween._newProps;
			tween._newProps = tmp;
			tween._reverseFlag = -1;

			for (var p in tween._oldProps) target[p] = tween._oldProps[p];

			tween._init();
			return tween;
		};

		/**
		 * 缓动函数集合。
		 */
		var Easing = Quark.Easing = {
			Linear: {},
			Quadratic: {},
			Cubic: {},
			Quartic: {},
			Quintic: {},
			Sinusoidal: {},
			Exponential: {},
			Circular: {},
			Elastic: {},
			Back: {},
			Bounce: {}
		};

		Easing.Linear.EaseNone = function(k) {
			return k;
		};

		Easing.Quadratic.EaseIn = function(k) {
			return k * k;
		};

		Easing.Quadratic.EaseOut = function(k) {
			return -k * (k - 2);
		};

		Easing.Quadratic.EaseInOut = function(k) {
			if ((k *= 2) < 1) return 0.5 * k * k;
			return -0.5 * (--k * (k - 2) - 1);
		};

		Easing.Cubic.EaseIn = function(k) {
			return k * k * k;
		};

		Easing.Cubic.EaseOut = function(k) {
			return --k * k * k + 1;
		};

		Easing.Cubic.EaseInOut = function(k) {
			if ((k *= 2) < 1) return 0.5 * k * k * k;
			return 0.5 * ((k -= 2) * k * k + 2);
		};

		Easing.Quartic.EaseIn = function(k) {
			return k * k * k * k;
		};

		Easing.Quartic.EaseOut = function(k) {
			return -(--k * k * k * k - 1);
		}

		Easing.Quartic.EaseInOut = function(k) {
			if ((k *= 2) < 1) return 0.5 * k * k * k * k;
			return -0.5 * ((k -= 2) * k * k * k - 2);
		};

		Easing.Quintic.EaseIn = function(k) {
			return k * k * k * k * k;
		};

		Easing.Quintic.EaseOut = function(k) {
			return (k = k - 1) * k * k * k * k + 1;
		};

		Easing.Quintic.EaseInOut = function(k) {
			if ((k *= 2) < 1) return 0.5 * k * k * k * k * k;
			return 0.5 * ((k -= 2) * k * k * k * k + 2);
		};

		Easing.Sinusoidal.EaseIn = function(k) {
			return -Math.cos(k * Math.PI / 2) + 1;
		};

		Easing.Sinusoidal.EaseOut = function(k) {
			return Math.sin(k * Math.PI / 2);
		};

		Easing.Sinusoidal.EaseInOut = function(k) {
			return -0.5 * (Math.cos(Math.PI * k) - 1);
		};

		Easing.Exponential.EaseIn = function(k) {
			return k == 0 ? 0 : Math.pow(2, 10 * (k - 1));
		};

		Easing.Exponential.EaseOut = function(k) {
			return k == 1 ? 1 : -Math.pow(2, -10 * k) + 1;
		};

		Easing.Exponential.EaseInOut = function(k) {
			if (k == 0) return 0;
			if (k == 1) return 1;
			if ((k *= 2) < 1) return 0.5 * Math.pow(2, 10 * (k - 1));
			return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
		};

		Easing.Circular.EaseIn = function(k) {
			return -(Math.sqrt(1 - k * k) - 1);
		};

		Easing.Circular.EaseOut = function(k) {
			return Math.sqrt(1 - --k * k);
		};

		Easing.Circular.EaseInOut = function(k) {
			if ((k /= 0.5) < 1) return -0.5 * (Math.sqrt(1 - k * k) - 1);
			return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
		};

		Easing.Elastic.EaseIn = function(k) {
			var s, a = 0.1,
				p = 0.4;
			if (k == 0) return 0;
			else if (k == 1) return 1;
			else if (!p) p = 0.3;
			if (!a || a < 1) {
				a = 1;
				s = p / 4;
			} else s = p / (2 * Math.PI) * Math.asin(1 / a);
			return -(a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
		};

		Easing.Elastic.EaseOut = function(k) {
			var s, a = 0.1,
				p = 0.4;
			if (k == 0) return 0;
			else if (k == 1) return 1;
			else if (!p) p = 0.3;
			if (!a || a < 1) {
				a = 1;
				s = p / 4;
			} else s = p / (2 * Math.PI) * Math.asin(1 / a);
			return (a * Math.pow(2, -10 * k) * Math.sin((k - s) * (2 * Math.PI) / p) + 1);
		};

		Easing.Elastic.EaseInOut = function(k) {
			var s, a = 0.1,
				p = 0.4;
			if (k == 0) return 0;
			else if (k == 1) return 1;
			else if (!p) p = 0.3;
			if (!a || a < 1) {
				a = 1;
				s = p / 4;
			} else s = p / (2 * Math.PI) * Math.asin(1 / a);
			if ((k *= 2) < 1) return -0.5 * (a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
			return a * Math.pow(2, -10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p) * 0.5 + 1;

		};

		Easing.Back.EaseIn = function(k) {
			var s = 1.70158;
			return k * k * ((s + 1) * k - s);
		};

		Easing.Back.EaseOut = function(k) {
			var s = 1.70158;
			return (k = k - 1) * k * ((s + 1) * k + s) + 1;
		};

		Easing.Back.EaseInOut = function(k) {
			var s = 1.70158 * 1.525;
			if ((k *= 2) < 1) return 0.5 * (k * k * ((s + 1) * k - s));
			return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
		};

		Easing.Bounce.EaseIn = function(k) {
			return 1 - Easing.Bounce.EaseOut(1 - k);
		};

		Easing.Bounce.EaseOut = function(k) {
			if ((k /= 1) < (1 / 2.75)) {
				return 7.5625 * k * k;
			} else if (k < (2 / 2.75)) {
				return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
			} else if (k < (2.5 / 2.75)) {
				return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
			} else {
				return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
			}
		};

		Easing.Bounce.EaseInOut = function(k) {
			if (k < 0.5) return Easing.Bounce.EaseIn(k * 2) * 0.5;
			return Easing.Bounce.EaseOut(k * 2 - 1) * 0.5 + 0.5;
		};

	})();



	(function() {

		/**
		 * 构造函数.
		 * @name Audio
		 * @class Audio类是原生Audio的封装。
		 * @param src 要加载的声音的地址。
		 * @param preload 指示是否自动加载，在某些浏览器下无效，如IOS上的Safari。
		 * @param autoPlay 指示是否自动播放，在某些浏览器下无效，如IOS上的Safari。
		 * @param loop 指示是否循环播放。
		 */
		var Audio = Quark.Audio = function(src, preload, autoPlay, loop) {
			Audio.superClass.constructor.call(this);

			this.src = src;
			this.autoPlay = preload && autoPlay;
			this.loop = loop;

			this._loaded = false;
			this._playing = false;
			this._evtHandler = Quark.delegate(this._evtHandler, this);

			this._element = document.createElement('audio');
			this._element.preload = preload;
			this._element.src = src;
			if (preload) this.load();
		};
		Quark.inherit(Audio, Quark.EventDispatcher);

		/**
		 * 开始加载声音文件。
		 */
		Audio.prototype.load = function() {
			this._element.addEventListener("progress", this._evtHandler, false);
			this._element.addEventListener("ended", this._evtHandler, false);
			this._element.addEventListener("error", this._evtHandler, false);
			try {
				this._element.load();
			} catch (e) {
				trace(e);
			};

		};

		/**
		 * 内部的声音事件处理。
		 * @private
		 */
		Audio.prototype._evtHandler = function(e) {
			if (e.type == "progress") {
				var i = 0,
					buffered = 0,
					ranges = e.target.buffered;
				if (ranges && ranges.length > 0) {
					for (i = ranges.length - 1; i >= 0; i--) {
						buffered = (ranges.end(i) - ranges.start(i));
					}
				}
				var percent = buffered / e.target.duration;
				if (percent >= 1) {
					this._element.removeEventListener("progress", this._evtHandler);
					this._element.removeEventListener("error", this._evtHandler);
					this._loaded = true;
					this.dispatchEvent({
						type: "loaded",
						target: this
					});
					if (this.autoPlay) this.play();
				}
			} else if (e.type == "ended") {
				this.dispatchEvent({
					type: "ended",
					target: this
				});
				if (this.loop) this.play();
				else this._playing = false;
			} else if (e.type == "error") {
				trace("Quark.Audio Error: " + e.target.src);
			}
		};

		/**
		 * 开始播放。
		 */
		Audio.prototype.play = function() {
			if (this._loaded) {
				this._element.play();
				this._playing = true;
			} else {
				this.autoPlay = true;
				this.load();
			}
		};

		/**
		 * 停止播放。
		 */
		Audio.prototype.stop = function() {
			if (this._playing) {
				this._element.pause();
				this._playing = false;
			}
		};

		/**
		 * 指示声音文件是否已被加载。
		 */
		Audio.prototype.loaded = function() {
			return this._loaded;
		};

		/**
		 * 指示声音是正在播放。
		 */
		Audio.prototype.playing = function() {
			return this._playing;
		};

	})();



	(function() {

		/**
		 * 构造函数.
		 * @name Drawable
		 * @class Drawable是可绘制图像或DOM的包装。当封装的是HTMLImageElement、HTMLCanvasElement或HTMLVideoElement对象时，可同时支持canvas和dom两种渲染方式，而如果封装的是dom时，则不支持canvas方式。
		 * @param drawable 一个可绘制对象。
		 * @param {Boolean} isDOM 指定参数drawable是否为一个DOM对象。默认为false。
		 */
		var Drawable = Quark.Drawable = function(drawable, isDOM) {
			this.rawDrawable = null;
			this.domDrawable = null;
			this.set(drawable, isDOM);
		};

		/**
		 * 根据context上下文获取不同的Drawable包装的对象。
		 * @param {DisplayObject} obj 指定的显示对象。
		 * @param {Context} context 指定的渲染上下文。
		 * @return 返回包装的可绘制对象。
		 */
		Drawable.prototype.get = function(obj, context) {
			if (context == null || context.canvas.getContext != null) {
				return this.rawDrawable;
			} else {
				if (this.domDrawable == null) {
					this.domDrawable = Quark.createDOMDrawable(obj, {
						image: this.rawDrawable
					});
				}
				return this.domDrawable;
			}
		};

		/**
		 * 设置Drawable对象。
		 * @param drawable 一个可绘制对象。
		 * @param {Boolean} isDOM 指定参数drawable是否为一个DOM对象。默认为false。
		 */
		Drawable.prototype.set = function(drawable, isDOM) {
			if (isDrawable(drawable)) this.rawDrawable = drawable;
			if (isDOM === true) {
				this.domDrawable = drawable;
			} else if (this.domDrawable) {
				this.domDrawable.style.backgroundImage = "url(" + this.rawDrawable.src + ")";
			}
		};

		function isDrawable(elem) {
			if (elem == null) return false;
			return (elem instanceof HTMLImageElement) ||
				(elem instanceof HTMLCanvasElement) ||
				(elem instanceof HTMLVideoElement);
		};

	})();



	(function() {

		/**
		 * 构造函数.
		 * @name DisplayObject
		 * @class DisplayObject类是可放在舞台上的所有显示对象的基类。DisplayObject类定义了若干显示对象的基本属性。渲染一个DisplayObject其实是进行若干变换后再渲染其drawable对象。
		 * @augments EventDispatcher
		 * @property id DisplayObject对象唯一标识符id。
		 * @property name DisplayObject对象的名称。
		 * @property x DisplayObject对象相对父容器的x轴坐标。
		 * @property y DisplayObject对象相对父容器的y轴坐标。
		 * @property regX DisplayObject对象的注册点（中心点）的x轴坐标。
		 * @property regY DisplayObject对象的注册点（中心点）的y轴坐标。
		 * @property width DisplayObject对象的宽。
		 * @property height DisplayObject对象的高。
		 * @property alpha DisplayObject对象的透明度。取值范围为0-1，默认为1。
		 * @property scaleX DisplayObject对象在x轴上的缩放值。取值范围为0-1。
		 * @property scaleY DisplayObject对象在y轴上的缩放值。取值范围为0-1。
		 * @property rotation DisplayObject对象的旋转角度。默认为0。
		 * @property visible 指示DisplayObject对象是否可见。默认为true。
		 * @property eventEnabled 指示DisplayObject对象是否接受交互事件，如mousedown，touchstart等。默认为true。
		 * @property transformEnabled 指示DisplayObject对象是否执行变换。默认为false。
		 * @property useHandCursor 指示DisplayObject对象是否支持手型的鼠标光标。默认为false。
		 * @property polyArea 指示DisplayObject对象的多边形碰撞区域。默认为null，即使用对象的外包围矩形。
		 * @property mask 指示DisplayObject对象的遮罩对象。当上下文为DOMContext时暂时只支持webkit内核浏览器。默认为null。
		 * @property parent DisplayObject对象的父容器。只读属性。
		 */
		var DisplayObject = Quark.DisplayObject = function(props) {
			this.id = Quark.UIDUtil.createUID("DisplayObject");

			this.name = null;
			this.x = 0;
			this.y = 0;
			this.regX = 0;
			this.regY = 0;
			this.width = 0;
			this.height = 0;
			this.alpha = 1;
			this.scaleX = 1;
			this.scaleY = 1;
			this.rotation = 0;
			this.visible = true;
			this.eventEnabled = true;
			this.transformEnabled = true;
			this.useHandCursor = false;
			this.polyArea = null;
			this.mask = null;

			this.drawable = null;
			this.parent = null;
			this.context = null;

			this._depth = 0;
			this._lastState = {};
			this._stateList = ["x", "y", "regX", "regY", "width", "height", "alpha", "scaleX", "scaleY", "rotation", "visible", "_depth"];

			Quark.merge(this, props, true);
			if (props.mixin) Quark.merge(this, props.mixin, false);

			DisplayObject.superClass.constructor.call(this, props);
		};
		Quark.inherit(DisplayObject, Quark.EventDispatcher);

		/**
		 * 设置可绘制对象，默认是一个Image对象，可通过覆盖此方法进行DOM绘制。
		 * @param {Object} drawable 要设置的可绘制对象。一般是一个Image对象。
		 */
		DisplayObject.prototype.setDrawable = function(drawable) {
			if (this.drawable == null) {
				this.drawable = new Quark.Drawable(drawable);
			} else if (this.drawable.rawDrawable != drawable) {
				this.drawable.set(drawable);
			}
		};

		/**
		 * 获得可绘制对象实体，如Image或Canvas等其他DOM对象。
		 * @param {Context} context 渲染上下文。
		 */
		DisplayObject.prototype.getDrawable = function(context) {
			//context = context || this.context || this.getStage().context;
			return this._cache || this.drawable && this.drawable.get(this, context);
		};

		/**
		 * 对象数据更新接口，仅供框架内部或组件开发者使用。用户通常应该重写update方法。
		 * @protected
		 */
		DisplayObject.prototype._update = function(timeInfo) {
			this.update(timeInfo);
		};

		/**
		 * 对象数据更新接口，可通过覆盖此方法实现对象的数据更新。
		 * @param {Object} timeInfo 对象更新所需的时间信息。
		 * @return {Boolean} 更新成功返回true，否则为false。
		 */
		DisplayObject.prototype.update = function(timeInfo) {
			return true;
		};

		/**
		 * 对象渲染接口，仅供框架内部或组件开发者使用。用户通常应该重写render方法。
		 * @protected
		 */
		DisplayObject.prototype._render = function(context) {
			var ctx = this.context || context;
			if (!this.visible || this.alpha <= 0) {
				if (ctx.hide != null) ctx.hide(this);
				this.saveState(["visible", "alpha"]);
				return;
			}

			ctx.startDraw();
			ctx.transform(this);
			this.render(ctx);
			ctx.endDraw();
			this.saveState();
		};

		/**
		 * DisplayObject对象渲染接口，可通过覆盖此方法实现对象的渲染。
		 * @param {Context} context 渲染上下文。
		 */
		DisplayObject.prototype.render = function(context) {
			context.draw(this, 0, 0, this.width, this.height, 0, 0, this.width, this.height);
		};

		/**
		 * 保存DisplayObject对象的状态列表中的各种属性状态。
		 * @param {Array} list 要保存的属性名称列表。默认为null。
		 */
		DisplayObject.prototype.saveState = function(list) {
			list = list || this._stateList;
			var state = this._lastState;
			for (var i = 0, len = list.length; i < len; i++) {
				var p = list[i];
				state["last" + p] = this[p];
			}
		};

		/**
		 * 获得DisplayObject对象保存的状态列表中的指定的属性状态。
		 * @param {String} propName 要获取的属性状态名称。
		 * @return 返回指定属性的最后一次保存状态值。
		 */
		DisplayObject.prototype.getState = function(propName) {
			return this._lastState["last" + propName];
		};

		/**
		 * 比较DisplayObject对象的当前状态和最近一次保存的状态，返回指定属性中是否发生改变。
		 * @param prop 可以是单个或多个属性参数。
		 * @return 属性改变返回true，否则返回false。
		 */
		DisplayObject.prototype.propChanged = function(prop) {
			var list = arguments.length > 0 ? arguments : this._stateList;
			for (var i = 0, len = list.length; i < len; i++) {
				var p = list[i];
				if (this._lastState["last" + p] != this[p]) return true;
			}
			return false;
		};

		/**
		 * 计算DisplayObject对象的包围矩形，以确定由x和y参数指定的点是否在其包围矩形之内。
		 * @param {Number} x 指定碰撞点的x坐标。
		 * @param {Number} y 指定碰撞点的y坐标。
		 * @param {Boolean} usePolyCollision 指定是否采用多边形碰撞。默认为false。
		 * @return {Number} 在包围矩形之内返回1，在边界上返回0，否则返回-1。
		 */
		DisplayObject.prototype.hitTestPoint = function(x, y, usePolyCollision) {
			return Quark.hitTestPoint(this, x, y, usePolyCollision);
		};

		/**
		 * 计算DisplayObject对象的包围矩形，以确定由object参数指定的显示对象是否与其相交。
		 * @param {DisplayObject} object 指定检测碰撞的显示对象。
		 * @param {Boolean} usePolyCollision 指定是否采用多边形碰撞。默认为false。
		 * @return {Boolean} 相交返回true，否则返回false。
		 */
		DisplayObject.prototype.hitTestObject = function(object, usePolyCollision) {
			return Quark.hitTestObject(this, object, usePolyCollision);
		};

		/**
		 * 将x和y指定的点从显示对象的（本地）坐标转换为舞台（全局）坐标。
		 * @param {Number} x 显示对象的本地x轴坐标。
		 * @param {Number} y 显示对象的本地y轴坐标。
		 * @return {Object} 返回转换后的全局坐标对象。格式如：{x:10, y:10}。
		 */
		DisplayObject.prototype.localToGlobal = function(x, y) {
			var cm = this.getConcatenatedMatrix();
			return {
				x: cm.tx + x,
				y: cm.ty + y
			};
		};

		/**
		 * 将x和y指定的点从舞台（全局）坐标转换为显示对象的（本地）坐标。
		 * @param {Number} x 显示对象的全局x轴坐标。
		 * @param {Number} y 显示对象的全局y轴坐标。
		 * @return {Object} 返回转换后的本地坐标对象。格式如：{x:10, y:10}。
		 */
		DisplayObject.prototype.globalToLocal = function(x, y) {
			var cm = this.getConcatenatedMatrix().invert();
			return {
				x: cm.tx + x,
				y: cm.ty + y
			};
		};

		/**
		 * 将x和y指定的点从显示对象的（本地）坐标转换为指定对象的坐标系里坐标。
		 * @param {Number} x 显示对象的本地x轴坐标。
		 * @param {Number} y 显示对象的本地y轴坐标。
		 * @return {Object} 返回转换后指定对象的本地坐标对象。格式如：{x:10, y:10}。
		 */
		DisplayObject.prototype.localToTarget = function(x, y, target) {
			var p = this.localToGlobal(x, y);
			return target.globalToLocal(p.x, p.y);
		};

		/**
		 * 获得一个对象相对于其某个祖先（默认即舞台）的连接矩阵。
		 * @private
		 */
		DisplayObject.prototype.getConcatenatedMatrix = function(ancestor) {
			var mtx = new Quark.Matrix(1, 0, 0, 1, 0, 0);
			if (ancestor == this) return mtx;
			for (var o = this; o.parent != null && o.parent != ancestor; o = o.parent) {
				var cos = 1,
					sin = 0;
				if (o.rotation % 360 != 0) {
					var r = o.rotation * Quark.DEG_TO_RAD;
					cos = Math.cos(r);
					sin = Math.sin(r);
				}

				if (o.regX != 0) mtx.tx -= o.regX;
				if (o.regY != 0) mtx.ty -= o.regY;

				mtx.concat(new Quark.Matrix(cos * o.scaleX, sin * o.scaleX, -sin * o.scaleY, cos * o.scaleY, o.x, o.y));
			}
			return mtx;
		};

		/**
		 * 返回DisplayObject对象在舞台全局坐标系内的矩形区域以及所有顶点。
		 * @return {Object} 返回显示对象的矩形区域。
		 */
		DisplayObject.prototype.getBounds = function() {
			var w = this.width,
				h = this.height;
			var mtx = this.getConcatenatedMatrix();

			var poly = this.polyArea || [{
				x: 0,
				y: 0
			}, {
				x: w,
				y: 0
			}, {
				x: w,
				y: h
			}, {
				x: 0,
				y: h
			}];

			var vertexs = [],
				len = poly.length,
				v, minX, maxX, minY, maxY;
			v = mtx.transformPoint(poly[0], true, true);
			minX = maxX = v.x;
			minY = maxY = v.y;
			vertexs[0] = v;

			for (var i = 1; i < len; i++) {
				var v = mtx.transformPoint(poly[i], true, true);
				if (minX > v.x) minX = v.x;
				else if (maxX < v.x) maxX = v.x;
				if (minY > v.y) minY = v.y;
				else if (maxY < v.y) maxY = v.y;
				vertexs[i] = v;
			}

			vertexs.x = minX;
			vertexs.y = minY;
			vertexs.width = maxX - minX;
			vertexs.height = maxY - minY;
			return vertexs;
		};

		/**
		 * 获得DisplayObject对象变形后的宽度。
		 * @return {Number} 返回对象变形后的宽度。
		 */
		DisplayObject.prototype.getCurrentWidth = function() {
			return Math.abs(this.width * this.scaleX);
		};

		/**
		 * 获得DisplayObject对象变形后的高度。
		 * @return {Number} 返回对象变形后的高度。
		 */
		DisplayObject.prototype.getCurrentHeight = function() {
			return Math.abs(this.height * this.scaleY);
		};

		/**
		 * 获得DisplayObject对象的舞台引用。如未被添加到舞台，则返回null。
		 * @return {Stage} 返回对象的舞台。
		 */
		DisplayObject.prototype.getStage = function() {
			var obj = this;
			while (obj.parent) obj = obj.parent;
			if (obj instanceof Quark.Stage) return obj;
			return null;
		};

		/**
		 * 把DisplayObject对象缓存到一个新的canvas，对于包含复杂内容且不经常改变的对象使用缓存，可以提高渲染速度。
		 * @param {Boolean} toImage 指定是否把缓存转为DataURL格式的。默认为false。
		 * @param {String} type 指定转换为DataURL格式的图片mime类型。默认为"image/png"。
		 * @return {Object} 显示对象的缓存结果。根据参数toImage不同而返回Canvas或Image对象。
		 */
		Quark.DisplayObject.prototype.cache = function(toImage, type) {
			return this._cache = Quark.cacheObject(this, toImage, type);
		};

		/**
		 * 清除缓存。
		 */
		Quark.DisplayObject.prototype.uncache = function() {
			this._cache = null;
		};

		/**
		 * 把DisplayObject对象转换成dataURL格式的位图。
		 * @param {String} type 指定转换为DataURL格式的图片mime类型。默认为"image/png"。
		 */
		Quark.DisplayObject.prototype.toImage = function(type) {
			return Quark.cacheObject(this, true, type);
		};

		/**
		 * 返回DisplayObject对象的全路径的字符串表示形式，方便debug。如Stage1.Container2.Bitmap3。
		 * @return {String} 返回对象的全路径的字符串表示形式。如Stage1.Container2.Bitmap3。
		 */
		DisplayObject.prototype.toString = function() {
			return Quark.UIDUtil.displayObjectToString(this);
		};

	})();



	(function() {

		/**
		 * 构造函数.
		 * @name DisplayObjectContainer
		 * @augments DisplayObject
		 * @class DisplayObjectContainer类继承自DisplayObject，是显示列表中显示对象容器的基类。每个DisplayObjectContainer对象都有自己的子级列表children，用于组织对象的Z轴顺序。注意：DisplayObjectContainer对象的宽高默认为0，在autoSize=false的情况下，需要手动设置宽高。
		 * @property eventChildren 指示DisplayObjectContainer的子元素是否接受交互事件，如mousedown，touchstart等。默认为true。
		 * @property autoSize 指示DisplayObjectContainer是否随子元素自动设置大小。默认为false。
		 */
		var DisplayObjectContainer = Quark.DisplayObjectContainer = function(props) {
			this.eventChildren = true;
			this.autoSize = false;
			this.children = [];

			props = props || {};
			DisplayObjectContainer.superClass.constructor.call(this, props);
			this.id = props.id || Quark.UIDUtil.createUID("DisplayObjectContainer");

			this.setDrawable(props.drawable || props.image || null);

			if (props.children) {
				for (var i = 0; i < props.children.length; i++) {
					this.addChild(props.children[i]);
				}
			}
		};
		Quark.inherit(DisplayObjectContainer, Quark.DisplayObject);

		/**
		 * 将一个DisplayObject子实例添加到该DisplayObjectContainer实例的子级列表中的指定位置。
		 * @param {DisplayObject} child 要添加的显示对象。
		 * @param {Integer} index 指定显示对象要被添加到的索引位置。
		 * @return {DisplayObjectContainer} 返回显示容器本身。
		 */
		DisplayObjectContainer.prototype.addChildAt = function(child, index) {
			if (index < 0) index = 0;
			else if (index > this.children.length) index = this.children.length;

			var childIndex = this.getChildIndex(child);
			if (childIndex != -1) {
				if (childIndex == index) return this;
				this.children.splice(childIndex, 1);
			} else if (child.parent) {
				child.parent.removeChild(child);
			}

			this.children.splice(index, 0, child);
			child.parent = this;

			if (this.autoSize) {
				var rect = new Quark.Rectangle(0, 0, this.rectWidth || this.width, this.rectHeight || this.height);
				var childRect = new Quark.Rectangle(child.x, child.y, child.rectWidth || child.width, child.rectHeight || child.height);
				rect.union(childRect);
				this.width = rect.width;
				this.height = rect.height;
			}

			return this;
		};

		/**
		 * 将一个DisplayObject子实例添加到该DisplayObjectContainer实例的子级列表中。
		 * @param {DisplayObject} child 要添加的显示对象。
		 * @return {DisplayObjectContainer} 返回显示容器本身。
		 */
		DisplayObjectContainer.prototype.addChild = function(child) {
			var start = this.children.length;
			for (var i = 0; i < arguments.length; i++) {
				var child = arguments[i];
				this.addChildAt(child, start + i);
			}
			return this;
		};

		/**
		 * 从DisplayObjectContainer的子级列表中指定索引处删除子对象。
		 * @param {Integer} index 指定要删除的显示对象的索引位置。
		 * @return {Boolean} 删除成功返回true，否则返回false。
		 */
		DisplayObjectContainer.prototype.removeChildAt = function(index) {
			if (index < 0 || index >= this.children.length) return false;
			var child = this.children[index];
			if (child != null) {
				var stage = this.getStage();
				if (stage != null) stage.context.remove(child);
				child.parent = null;
			}
			this.children.splice(index, 1);
			return true;
		};

		/**
		 * 从DisplayObjectContainer的子级列表中删除指定子对象。
		 * @param {DisplayObject} child 指定要删除的显示对象。
		 * @return {Boolean} 删除成功返回true，否则返回false。
		 */
		DisplayObjectContainer.prototype.removeChild = function(child) {
			return this.removeChildAt(this.children.indexOf(child));
		};

		/**
		 * 删除DisplayObjectContainer的所有子对象。
		 */
		DisplayObjectContainer.prototype.removeAllChildren = function() {
			while (this.children.length > 0) this.removeChildAt(0);
		};

		/**
		 * 返回DisplayObjectContainer的位于指定索引处的子显示对象。
		 * @param {Integer} index 指定子显示对象的索引位置。
		 * @return {DisplayObject} 返回指定的子显示对象。
		 */
		DisplayObjectContainer.prototype.getChildAt = function(index) {
			if (index < 0 || index >= this.children.length) return null;
			return this.children[index];
		};

		/**
		 * 返回指定对象在DisplayObjectContainer的子级列表中的索引位置。
		 * @param {Integer} child 指定子显示对象。
		 * @return {Integer} 返回指定子显示对象的索引位置。
		 */
		DisplayObjectContainer.prototype.getChildIndex = function(child) {
			return this.children.indexOf(child);
		};

		/**
		 * 设置指定对象在DisplayObjectContainer的子级列表中的索引位置。
		 * @param {DisplayObject} child 指定子显示对象。
		 * @param {Integer} index 指定子显示对象新的索引位置。
		 */
		DisplayObjectContainer.prototype.setChildIndex = function(child, index) {
			if (child.parent != this) return;
			var oldIndex = this.children.indexOf(child);
			if (index == oldIndex) return;
			this.children.splice(oldIndex, 1);
			this.children.splice(index, 0, child);
		};

		/**
		 * 交换在DisplayObjectContainer的子级列表中的两个子对象的索引位置。
		 * @param {DisplayObject} child1 指定交换索引位置的子显示对象1。
		 * @param {DisplayObject} child2 指定交换索引位置的子显示对象2。
		 */
		DisplayObjectContainer.prototype.swapChildren = function(child1, child2) {
			var index1 = this.getChildIndex(child1),
				index2 = this.getChildIndex(child2);
			this.children[index1] = child2;
			this.children[index2] = child1;
		};

		/**
		 * 交换在DisplayObjectContainer的子级列表中的指定索引位置的两个子对象。
		 * @param {Integer} index1 指定交换索引位置1。
		 * @param {Integer} index2 指定交换索引位置2。
		 */
		DisplayObjectContainer.prototype.swapChildrenAt = function(index1, index2) {
			var child1 = this.getChildAt(index1),
				child2 = this.getChildAt(index2);
			this.children[index1] = child2;
			this.children[index2] = child1;
		};

		/**
		 * 返回DisplayObjectContainer中指定id的子显示对象。
		 * @param {String} 指定子显示对象的id。
		 * @return {DisplayObject} 返回指定id的子显示对象。
		 */
		DisplayObjectContainer.prototype.getChildById = function(id) {
			for (var i = 0, len = this.children.length; i < len; i++) {
				var child = this.children[i];
				if (child.id == id) return child;
			}
			return null;
		};

		/**
		 * 删除并返回DisplayObjectContainer中指定id的子显示对象。
		 * @param {String} 指定子显示对象的id。
		 * @return {DisplayObject} 返回删除的指定id的子显示对象。
		 */
		DisplayObjectContainer.prototype.removeChildById = function(id) {
			for (var i = 0, len = this.children.length; i < len; i++) {
				if (this.children[i].id == id) {
					return this.removeChildAt(i);
				}
			}
			return null;
		};

		/**
		 * 根据参数keyOrFunction指定的子元素键值或自定义函数对DisplayObjectContainer的子元素进行排序。
		 * @param keyOrFunction 指定排序的子元素的键值或自定义函数。
		 */
		DisplayObjectContainer.prototype.sortChildren = function(keyOrFunction) {
			var f = keyOrFunction;
			if (typeof(f) == "string") {
				var key = f;
				f = function(a, b) {
					return b[key] - a[key];
				};
			}
			this.children.sort(f);
		};

		/**
		 * 确定指定对象是否为DisplayObjectContainer的子显示对象。
		 * @param {DisplayObject} child 指定的显示对象。
		 * @return {Boolean} 指定对象为DisplayObjectContainer的子显示对象返回true，否则返回false。
		 */
		DisplayObjectContainer.prototype.contains = function(child) {
			return this.getChildIndex(child) != -1;
		};

		/**
		 * 返回DisplayObjectContainer的子显示对象的数量。
		 * @return {Integer} 返回子显示对象的数量。
		 */
		DisplayObjectContainer.prototype.getNumChildren = function() {
			return this.children.length;
		};

		/**
		 * 覆盖父类DisplayObject的_update方法，更新所有子显示对象的深度。
		 * @protected
		 */
		DisplayObjectContainer.prototype._update = function(timeInfo) {
			//先更新容器本身的数据，再更新子元素的数据
			var result = true;
			if (this.update != null) result = this.update(timeInfo);
			if (result === false) return;

			var copy = this.children.slice(0);
			for (var i = 0, len = copy.length; i < len; i++) {
				var child = copy[i];
				child._depth = i + 1;
				child._update(timeInfo);
			}
		};

		/**
		 * 渲染DisplayObjectContainer本身及其所有子显示对象。
		 * @param {Context} 渲染上下文。
		 */
		DisplayObjectContainer.prototype.render = function(context) {
			DisplayObjectContainer.superClass.render.call(this, context);

			for (var i = 0, len = this.children.length; i < len; i++) {
				var child = this.children[i];
				child._render(context);
			}
		};

		/**
		 * 返回x和y指定点下的DisplayObjectContainer的子项（或孙子项，依此类推）的数组集合。默认只返回最先加入的子显示对象。
		 * @param {Number} x 指定点的x轴坐标。
		 * @param {Number} y 指定点的y轴坐标。
		 * @param {Boolean} usePolyCollision 指定是否采用多边形碰撞检测。默认为false。
		 * @param {Boolean} returnAll 指定是否返回指定点下的所有显示对象。默认为false。
		 * @return 返回指定点下的显示对象集合，当然returnAll为false时只返回最先加入的子显示对象。
		 */
		DisplayObjectContainer.prototype.getObjectUnderPoint = function(x, y, usePolyCollision, returnAll) {
			if (returnAll) var result = [];

			for (var i = this.children.length - 1; i >= 0; i--) {
				var child = this.children[i];
				if (child == null || (!child.eventEnabled && child.children == undefined) || !child.visible || child.alpha <= 0) continue;

				if (child.children != undefined && child.eventChildren && child.getNumChildren() > 0) {
					var obj = child.getObjectUnderPoint(x, y, usePolyCollision, returnAll);
					if (obj) {
						if (returnAll) {
							if (obj.length > 0) result = result.concat(obj);
						} else return obj;
					} else if (child.hitTestPoint(x, y, usePolyCollision) >= 0) {
						if (returnAll) result.push(child);
						else return child;
					}
				} else {
					if (child.hitTestPoint(x, y, usePolyCollision) >= 0) {
						if (returnAll) result.push(child);
						else return child;
					}
				}
			}
			if (returnAll) return result;
			return null;
		};

	})();



	(function() {

		/**
		 * 构造函数.
		 * @name Stage
		 * @augments DisplayObjectContainer
		 * @class 舞台是显示对象的根，所有显示对象都会被添加到舞台上，必须传入一个context使得舞台能被渲染。舞台是一种特殊显示对象容器，可以容纳子显示对象。
		 * @property stageX 舞台在页面中的X偏移量，即offsetLeft。只读属性。可通过调用updatePosition()方法更新。
		 * @property stageY 舞台在页面中的Y偏移量，即offsetTop。只读属性。可通过调用updatePosition()方法更新。
		 * @property paused 指示舞台更新和渲染是否暂停。默认为false。
		 * @argument props 参数JSON格式为：{context:context} context上下文必须指定。
		 */
		var Stage = Quark.Stage = function(props) {
			this.stageX = 0;
			this.stageY = 0;
			this.paused = false;

			this._eventTarget = null;

			props = props || {};
			Stage.superClass.constructor.call(this, props);
			this.id = props.id || Quark.UIDUtil.createUID("Stage");
			if (this.context == null) throw "Quark.Stage Error: context is required.";

			this.updatePosition();
		};
		Quark.inherit(Stage, Quark.DisplayObjectContainer);

		/**
		 * 更新舞台Stage上的所有显示对象。可被Quark.Timer对象注册调用。
		 */
		Stage.prototype.step = function(timeInfo) {
			if (this.paused) return;
			this._update(timeInfo);
			this._render(this.context);
		};

		/**
		 * 更新舞台Stage上所有显示对象的数据。
		 */
		Stage.prototype._update = function(timeInfo) {
			//Stage作为根容器，先更新所有子对象，再调用update方法。
			var copy = this.children.slice(0);
			for (var i = 0, len = copy.length; i < len; i++) {
				var child = copy[i];
				child._depth = i + 1;
				child._update(timeInfo);
			}
			//update方法提供渲染前更新舞台对象的数据的最后机会。
			if (this.update != null) this.update(timeInfo);
		};

		/**
		 * 渲染舞台Stage上的所有显示对象。
		 */
		Stage.prototype._render = function(context) {
			//在canvas渲染方式下，先清除整个画布。
			if (context.clear != null) context.clear(0, 0, this.width, this.height);
			Stage.superClass._render.call(this, context);
		};

		/**
		 * 舞台Stage默认的事件处理器。
		 */
		Stage.prototype.dispatchEvent = function(e) {
			var x = e.pageX || e.clientX,
				y = e.pageY || e.clientY;
			x = (x - this.stageX) / this.scaleX;
			y = (y - this.stageY) / this.scaleY;
			var obj = this.getObjectUnderPoint(x, y, true),
				target = this._eventTarget;

			e.eventX = x;
			e.eventY = y;

			var leave = e.type == "mouseout" && !this.context.canvas.contains(e.relatedTarget);
			if (target != null && (target != obj || leave)) {
				e.lastEventTarget = target;
				//派发移开事件mouseout或touchout到上一个事件对象
				var outEvent = (leave || obj == null || e.type == "mousemove") ? "mouseout" : e.type == "touchmove" ? "touchout" : null;
				if (outEvent) target.dispatchEvent({
					type: outEvent
				});
				this._eventTarget = null;
			}

			//派发事件到目标对象
			if (obj != null && obj.eventEnabled && e.type != "mouseout") {
				e.eventTarget = target = this._eventTarget = obj;
				obj.dispatchEvent(e);
			}

			//设置光标状态
			if (!Quark.supportTouch) {
				var cursor = (target && target.useHandCursor && target.eventEnabled) ? "pointer" : "";
				this.context.canvas.style.cursor = cursor;
			}

			if (leave || e.type != "mouseout") Stage.superClass.dispatchEvent.call(this, e);
		};

		/**
		 * 更新舞台Stage在页面中的偏移位置，即stageX/stageY。
		 */
		Stage.prototype.updatePosition = function() {
			var offset = Quark.getElementOffset(this.context.canvas);
			this.stageX = offset.left;
			this.stageY = offset.top;
		};

	})();



	(function() {

		/**
		 * 构造函数.
		 * @name Bitmap
		 * @augments DisplayObject
		 * @class Bitmap位图类，表示位图图像的显示对象，简单说它就是Image对象的某个区域的抽象表示。
		 * @argument {Object} props 一个对象，包含以下属性：
		 * <p>image - Image对象。</p>
		 * <p>rect - Image对象的矩形区域。格式为：[0,0,100,100]</p>
		 */
		var Bitmap = Quark.Bitmap = function(props) {
			this.image = null;
			this.rectX = 0; //ready-only
			this.rectY = 0; //ready-only
			this.rectWidth = 0; //ready-only
			this.rectHeight = 0; //ready-only

			props = props || {};
			Bitmap.superClass.constructor.call(this, props);
			this.id = props.id || Quark.UIDUtil.createUID("Bitmap");

			this.setRect(props.rect || [0, 0, this.image.width, this.image.height]);
			this.setDrawable(this.image);
			this._stateList.push("rectX", "rectY", "rectWidth", "rectHeight");
		};
		Quark.inherit(Bitmap, Quark.DisplayObject);

		/**
		 * 设置Bitmap对象的image的显示区域。
		 * @param {Array} rect 要设置的显示区域数组。格式为：[rectX, rectY, rectWidth, rectHeight]。
		 */
		Bitmap.prototype.setRect = function(rect) {
			this.rectX = rect[0];
			this.rectY = rect[1];
			this.rectWidth = this.width = rect[2];
			this.rectHeight = this.height = rect[3];
		};

		/**
		 * 覆盖父类的渲染方法。渲染image指定的显示区域。
		 * @param {Context} context 渲染上下文。
		 */
		Bitmap.prototype.render = function(context) {
			context.draw(this, this.rectX, this.rectY, this.rectWidth, this.rectHeight, 0, 0, this.width, this.height);
		};

	})();



	(function() {

		/**
		 * 构造函数.
		 * @name MovieClip
		 * @augments Bitmap
		 * @class MovieClip影片剪辑类，表示一组动画片段。MovieClip是由Image对象的若干矩形区域组成的集合序列，并按照一定规则顺序播放。帧frame的定义格式为：{rect:*required*, label:"", interval:0, stop:0, jump:-1}。
		 */
		var MovieClip = Quark.MovieClip = function(props) {
			this.interval = 0;
			this.paused = false;
			this.useFrames = false;
			this.currentFrame = 0; //read-only

			this._frames = [];
			this._frameLabels = {};
			this._frameDisObj = null;
			this._displayedCount = 0;

			props = props || {};
			MovieClip.superClass.constructor.call(this, props);
			this.id = props.id || Quark.UIDUtil.createUID("MovieClip");

			if (props.frames) this.addFrame(props.frames);
		};
		Quark.inherit(MovieClip, Quark.Bitmap);

		/**
		 * 向MovieClip中添加帧frame，可以是单个帧或多帧的数组。
		 */
		MovieClip.prototype.addFrame = function(frame) {
			var start = this._frames.length;
			if (frame instanceof Array) {
				for (var i = 0; i < frame.length; i++) this.setFrame(frame[i], start + i);
			} else {
				this.setFrame(frame, start);
			}
			return this;
		};

		/**
		 * 指定帧frame在MovieClip的播放序列中的位置（从0开始）。
		 */
		MovieClip.prototype.setFrame = function(frame, index) {
			if (index == undefined || index > this._frames.length) index = this._frames.length;
			else if (index < 0) index = 0;

			this._frames[index] = frame;
			if (frame.label) this._frameLabels[frame.label] = frame;
			if (frame.interval == undefined) frame.interval = this.interval;
			if (index == 0 && this.currentFrame == 0) this.setRect(frame.rect);
		};

		/**
		 * 获得指定位置或标签的帧frame。
		 */
		MovieClip.prototype.getFrame = function(indexOrLabel) {
			if (typeof(indexOrLabel) == "number") return this._frames[indexOrLabel];
			return this._frameLabels[indexOrLabel];
		};

		/**
		 * 从当前位置开始播放动画序列。
		 */
		MovieClip.prototype.play = function() {
			this.paused = false;
		};

		/**
		 * 停止播放动画序列。
		 */
		MovieClip.prototype.stop = function() {
			this.paused = true;
		};

		/**
		 * 跳转到指定位置或标签的帧，并停止播放动画序列。
		 */
		MovieClip.prototype.gotoAndStop = function(indexOrLabel) {
			this.currentFrame = this.getFrameIndex(indexOrLabel);
			this.paused = true;
		};

		/**
		 * 跳转到指定位置或标签的帧，并继续播放动画序列。
		 */
		MovieClip.prototype.gotoAndPlay = function(indexOrLabel) {
			this.currentFrame = this.getFrameIndex(indexOrLabel);
			this.paused = false;
		};

		/**
		 * 获得指定参数对应的帧的位置。
		 */
		MovieClip.prototype.getFrameIndex = function(indexOrLabel) {
			if (typeof(indexOrLabel) == "number") return indexOrLabel;
			var frame = this._frameLabels[indexOrLabel],
				frames = this._frames;
			for (var i = 0; i < frames.length; i++) {
				if (frame == frames[i]) return i;
			}
			return -1;
		};

		/**
		 * 播放动画序列的下一帧。
		 */
		MovieClip.prototype.nextFrame = function(displayedDelta) {
			var frame = this._frames[this.currentFrame];

			if (frame.interval > 0) {
				var count = this._displayedCount + displayedDelta;
				this._displayedCount = frame.interval > count ? count : 0;
			}

			if (frame.jump >= 0 || typeof(frame.jump) == "string") {
				if (this._displayedCount == 0 || !frame.interval) {
					return this.currentFrame = this.getFrameIndex(frame.jump);
				}
			}

			if (frame.interval > 0 && this._displayedCount > 0) return this.currentFrame;
			else if (this.currentFrame >= this._frames.length - 1) return this.currentFrame = 0;
			else return ++this.currentFrame;
		};

		/**
		 * 返回MovieClip的帧数。
		 */
		MovieClip.prototype.getNumFrames = function() {
			return this._frames.length;
		};

		/**
		 * 更新MovieClip对象的属性。
		 */
		MovieClip.prototype._update = function(timeInfo) {
			var frame = this._frames[this.currentFrame];
			if (frame.stop) {
				this.stop();
				return;
			}

			if (!this.paused) {
				var delta = this.useFrames ? 1 : timeInfo && timeInfo.deltaTime;
				frame = this._frames[this.nextFrame(delta)];
			}
			this.setRect(frame.rect);

			MovieClip.superClass._update.call(this, timeInfo);
		};

		/**
		 * 渲染当前帧到舞台。
		 */
		MovieClip.prototype.render = function(context) {
			var frame = this._frames[this.currentFrame],
				rect = frame.rect;
			context.draw(this, rect[0], rect[1], rect[2], rect[3], 0, 0, this.width, this.height);
		};

	})();



	(function() {

		/**
		 * 构造函数.
		 * @name Button
		 * @augments DisplayObjectContainer
		 * @class Button类继承自DisplayObjectContainer，是Quark中的简单按钮实现。
		 * @argument {Object} props 一个对象，包含以下属性：
		 * <p>image - Image对象。</p>
		 * <p>up - 按钮弹起状态下的显示帧数组对象。如：[0,0,50,50]。
		 * <p>over - 按钮经过状态下的显示帧数组对象。如：[50,0,50,50]。
		 * <p>down - 按钮按下状态下的显示帧数组对象。如：[100,0,50,50]。
		 * <p>disabled - 按钮不可用状态下的显示帧数组对象。如：[150,0,50,50]。
		 */
		var Button = Quark.Button = function(props) {
			this.state = Button.UP;
			this.enabled = true;

			props = props || {};
			Button.superClass.constructor.call(this, props);
			this.id = props.id || Quark.UIDUtil.createUID("Button");

			this._skin = new Quark.MovieClip({
				id: "skin",
				image: props.image
			});
			this.addChild(this._skin);
			this._skin.stop();

			this.eventChildren = false;
			if (props.useHandCursor === undefined) this.useHandCursor = true;
			if (props.up) this.setUpState(props.up);
			if (props.over) this.setOverState(props.over);
			if (props.down) this.setDownState(props.down);
			if (props.disabled) this.setDisabledState(props.disabled);
		};
		Quark.inherit(Button, Quark.DisplayObjectContainer);

		/**
		 * 按钮的弹起状态。常量值。
		 */
		Button.UP = "up";
		/**
		 * 按钮的经过状态。常量值。
		 */
		Button.OVER = "over";
		/**
		 * 按钮的按下状态。常量值。
		 */
		Button.DOWN = "down";
		/**
		 * 按钮的不可用状态。常量值。
		 */
		Button.DISABLED = "disabled";

		/**
		 * 设置按钮弹起状态的显示帧。
		 * @param {Array} upState 弹起状态的显示帧。
		 * @return {Button} 返回按钮本身。
		 */
		Button.prototype.setUpState = function(upState) {
			upState.label = Button.UP;
			this._skin.setFrame(upState, 0);
			this.upState = upState;
			return this;
		};

		/**
		 * 设置按钮经过状态的显示帧。
		 * @param {Array} overState 经过状态的显示帧。
		 * @return {Button} 返回按钮本身。
		 */
		Button.prototype.setOverState = function(overState) {
			overState.label = Button.OVER;
			this._skin.setFrame(overState, 1);
			this.overState = overState;
			return this;
		};

		/**
		 * 设置按钮按下状态的显示帧。
		 * @param {Array} downState 点击状态的显示帧。
		 * @return {Button} 返回按钮本身。
		 */
		Button.prototype.setDownState = function(downState) {
			downState.label = Button.DOWN;
			this._skin.setFrame(downState, 2);
			this.downState = downState;
			return this;
		};

		/**
		 * 设置按钮不可用状态的显示帧。
		 * @param {Array} disabledState 不可用状态的显示帧。
		 * @return {Button} 返回按钮本身。
		 */
		Button.prototype.setDisabledState = function(disabledState) {
			disabledState.label = Button.DISABLED;
			this._skin.setFrame(disabledState, 3);
			this.disabledState = disabledState;
			return this;
		};

		/**
		 * 设置按钮是否启用。
		 * @param {Boolean} enabled 指定按钮是否启用。默认为false。
		 * @return {Button} 返回按钮本身。
		 */
		Button.prototype.setEnabled = function(enabled) {
			if (this.enabled == enabled) return this;
			this.eventEnabled = this.enabled = enabled;
			if (!enabled) {
				if (this.disabledState) this._skin.gotoAndStop(Button.DISABLED);
				else this._skin.gotoAndStop(Button.UP);
			} else {
				if (this._skin.currentFrame == 3) this._skin.gotoAndStop(Button.UP);
			}
			return this;
		};

		/**
		 * 改变按钮的显示状态。
		 * @param {String} state 指定按钮的显示状态。
		 * @return {Button} 返回按钮本身。
		 */
		Button.prototype.changeState = function(state) {
			if (this.state == state) return;
			this.state = state;

			switch (state) {
				case Button.OVER:
				case Button.DOWN:
				case Button.UP:
					if (!this.enabled) this.eventEnabled = this.enabled = true;
					this._skin.gotoAndStop(state);
					break;
				case Button.DISABLED:
					this.setEnabled(false);
					break;
			}
			return this;
		};

		/**
		 * 按钮的默认事件处理行为。
		 * @private
		 */
		Button.prototype.dispatchEvent = function(e) {
			if (!this.enabled) return;

			switch (e.type) {
				case "mousemove":
					if (this.overState) this.changeState(Button.OVER);
					break;
				case "mousedown":
				case "touchstart":
				case "touchmove":
					if (this.downState) this.changeState(Button.DOWN);
					break;
				case "mouseup":
					if (this.overState) this.changeState(Button.OVER);
					else this.changeState(Button.UP);
					break;
				case "mouseout":
				case "touchout":
				case "touchend":
					if (this.upState) this.changeState(Button.UP);
					break;
			}
			Button.superClass.dispatchEvent.call(this, e);
		};

		/**
		 * 把Button的drawable置空，否则传入image参数时会绘制成Button的背景。
		 * @private
		 */
		Button.prototype.setDrawable = function(drawable) {
			Button.superClass.setDrawable.call(this, null);
		};

	})();



	(function() {

		/**
		 * 构造函数.
		 * @name Graphics
		 * @augments DisplayObject
		 * @class Graphics类包含一组创建矢量图形的方法。
		 */
		var Graphics = Quark.Graphics = function(props) {
			this.lineWidth = 1;
			this.strokeStyle = "0";
			this.lineAlpha = 1;
			this.lineCap = null; //"butt", "round", "square"
			this.lineJoin = null; //"miter", "round", "bevel"
			this.miterLimit = 10;

			this.hasStroke = false;
			this.hasFill = false;

			this.fillStyle = "0";
			this.fillAlpha = 1;

			props = props || {};
			Graphics.superClass.constructor.call(this, props);
			this.id = Quark.UIDUtil.createUID("Graphics");

			this._actions = [];
			this._cache = null;
		};
		Quark.inherit(Graphics, Quark.DisplayObject);

		/**
		 * 指定绘制图形的线条样式。
		 */
		Graphics.prototype.lineStyle = function(thickness, lineColor, alpha, lineCap, lineJoin, miterLimit) {
			this._addAction(["lineWidth", (this.lineWidth = thickness || 1)]);
			this._addAction(["strokeStyle", (this.strokeStyle = lineColor || "0")]);
			this._addAction(["lineAlpha", (this.lineAlpha = alpha || 1)]);
			if (lineCap != undefined) this._addAction(["lineCap", (this.lineCap = lineCap)]);
			if (lineJoin != undefined) this._addAction(["lineJoin", (this.lineJoin = lineJoin)]);
			if (miterLimit != undefined) this._addAction(["miterLimit", (this.miterLimit = miterLimit)]);
			this.hasStroke = true;
			return this;
		};

		/**
		 * 指定绘制图形的填充样式和透明度。
		 */
		Graphics.prototype.beginFill = function(fill, alpha) {
			this._addAction(["fillStyle", (this.fillStyle = fill)]);
			this._addAction(["fillAlpha", (this.fillAlpha = alpha || 1)]);
			this.hasFill = true;
			return this;
		};

		/**
		 * 应用并结束笔画的绘制和图形样式的填充。
		 */
		Graphics.prototype.endFill = function() {
			if (this.hasStroke) this._addAction(["stroke"]);
			if (this.hasFill) this._addAction(["fill"]);
			return this;
		};

		/**
		 * 指定绘制图形的线性渐变填充样式。
		 */
		Graphics.prototype.beginLinearGradientFill = function(x0, y0, x1, y1, colors, ratios) {
			var gradient = Graphics._getContext().createLinearGradient(x0, y0, x1, y1);
			for (var i = 0, len = colors.length; i < len; i++) {
				gradient.addColorStop(ratios[i], colors[i]);
			}
			return this._addAction(["fillStyle", (this.fillStyle = gradient)]);
		};

		/**
		 * 指定绘制图形的放射性渐变填充样式。
		 */
		Graphics.prototype.beginRadialGradientFill = function(x0, y0, r0, x1, y1, r1, colors, ratios) {
			var gradient = Graphics._getContext().createRadialGradient(x0, y0, r0, x1, y1, r1);
			for (var i = 0, len = colors.length; i < len; i++) {
				gradient.addColorStop(ratios[i], colors[i]);
			}
			return this._addAction(["fillStyle", (this.fillStyle = gradient)]);
		};

		/**
		 * 开始一个位图填充样式。
		 * @param {HTMLImageElement} image 指定填充的Image对象。
		 * @param {String} repetition 指定填充的重复设置参数。它可以是以下任意一个值：repeat, repeat-x, repeat-y, no-repeat。默认为""。
		 */
		Graphics.prototype.beginBitmapFill = function(image, repetition) {
			var pattern = Graphics._getContext().createPattern(image, repetition || "");
			return this._addAction(["fillStyle", (this.fillStyle = pattern)]);
		};

		/**
		 * 开始一个新的路径。
		 */
		Graphics.prototype.beginPath = function() {
			return this._addAction(["beginPath"]);
		};

		/**
		 * 关闭当前的路径。
		 */
		Graphics.prototype.closePath = function() {
			return this._addAction(["closePath"]);
		};

		/**
		 * 绘制一个矩形。
		 */
		Graphics.prototype.drawRect = function(x, y, width, height) {
			return this._addAction(["rect", x, y, width, height]);
		};

		/**
		 * 绘制一个复杂的圆角矩形。
		 */
		Graphics.prototype.drawRoundRectComplex = function(x, y, width, height, cornerTL, cornerTR, cornerBR, cornerBL) {
			this._addAction(["moveTo", x + cornerTL, y]);
			this._addAction(["lineTo", x + width - cornerTR, y]);
			this._addAction(["arc", x + width - cornerTR, y + cornerTR, cornerTR, -Math.PI / 2, 0, false]);
			this._addAction(["lineTo", x + width, y + height - cornerBR]);
			this._addAction(["arc", x + width - cornerBR, y + height - cornerBR, cornerBR, 0, Math.PI / 2, false]);
			this._addAction(["lineTo", x + cornerBL, y + height]);
			this._addAction(["arc", x + cornerBL, y + height - cornerBL, cornerBL, Math.PI / 2, Math.PI, false]);
			this._addAction(["lineTo", x, y + cornerTL]);
			this._addAction(["arc", x + cornerTL, y + cornerTL, cornerTL, Math.PI, Math.PI * 3 / 2, false]);
			return this;
		};

		/**
		 * 绘制一个圆角矩形。
		 */
		Graphics.prototype.drawRoundRect = function(x, y, width, height, cornerSize) {
			return this.drawRoundRectComplex(x, y, width, height, cornerSize, cornerSize, cornerSize, cornerSize);
		};

		/**
		 * 绘制一个圆。
		 */
		Graphics.prototype.drawCircle = function(x, y, radius) {
			return this._addAction(["arc", x + radius, y + radius, radius, 0, Math.PI * 2, 0]);
		};

		/**
		 * 绘制一个椭圆。
		 */
		Graphics.prototype.drawEllipse = function(x, y, width, height) {
			if (width == height) return this.drawCircle(x, y, width);

			var w = width / 2,
				h = height / 2,
				C = 0.5522847498307933,
				cx = C * w,
				cy = C * h;
			x = x + w;
			y = y + h;

			this._addAction(["moveTo", x + w, y]);
			this._addAction(["bezierCurveTo", x + w, y - cy, x + cx, y - h, x, y - h]);
			this._addAction(["bezierCurveTo", x - cx, y - h, x - w, y - cy, x - w, y]);
			this._addAction(["bezierCurveTo", x - w, y + cy, x - cx, y + h, x, y + h]);
			this._addAction(["bezierCurveTo", x + cx, y + h, x + w, y + cy, x + w, y]);
			return this;
		};

		/**
		 * 根据参数指定的SVG数据绘制一条路径。
		 * 代码示例:
		 * <p>var path = "M250 150 L150 350 L350 350 Z";</p>
		 * <p>var shape = new Quark.Graphics({width:500, height:500});</p>
		 * <p>shape.drawSVGPath(path).beginFill("#0ff").endFill();</p>
		 */
		Graphics.prototype.drawSVGPath = function(pathData) {
			var path = pathData.split(/,| (?=[a-zA-Z])/);

			this._addAction(["beginPath"]);
			for (var i = 0, len = path.length; i < len; i++) {
				var str = path[i],
					cmd = str[0].toUpperCase(),
					p = str.substring(1).split(/,| /);
				if (p[0].length == 0) p.shift();

				switch (cmd) {
					case "M":
						this._addAction(["moveTo", p[0], p[1]]);
						break;
					case "L":
						this._addAction(["lineTo", p[0], p[1]]);
						break;
					case "C":
						this._addAction(["bezierCurveTo", p[0], p[1], p[2], p[3], p[4], p[5]]);
						break;
					case "Z":
						this._addAction(["closePath"]);
						break;
					default:
						break;
				}
			}
			return this;
		};

		/**
		 * 执行全部绘制动作。内部私有方法。
		 * @private
		 */
		Graphics.prototype._draw = function(context) {
			context.beginPath();
			for (var i = 0, len = this._actions.length; i < len; i++) {
				var action = this._actions[i],
					f = action[0],
					args = action.length > 1 ? action.slice(1) : null;

				if (typeof(context[f]) == "function") context[f].apply(context, args);
				else context[f] = action[1];
			}
		};

		/**
		 * Override method.
		 * @private
		 */
		Graphics.prototype.getDrawable = function(context) {
			//for DOMContext drawing only
			if (this.drawable == null) this.setDrawable(this.toImage());
			return this.drawable.get(this, context);
		};

		/**
		 * 缓存graphics到一个canvas或image。可用来提高渲染效率。
		 */
		Graphics.prototype.cache = function(toImage) {
			var canvas = Quark.createDOM("canvas", {
				width: this.width,
				height: this.height
			});
			this._draw(canvas.getContext("2d"));

			this._cache = canvas;
			if (toImage) this._cache = this.toImage();
			return this._cache;
		};

		/**
		 * 清除缓存。
		 */
		Graphics.prototype.uncache = function() {
			this._cache = null;
		};

		/**
		 * 把Graphics对象转换成dataURL格式的位图。
		 * @param {String} type 指定转换为DataURL格式的图片mime类型。默认为"image/png"。
		 */
		Graphics.prototype.toImage = function(type) {
			var cache = this._cache || this.cache(true);
			if (cache instanceof HTMLImageElement) return cache;

			var img = new Image();
			img.src = cache.toDataURL(type || "image/png");
			img.width = this.width;
			img.height = this.height;
			return img;
		};

		/**
		 * 清除所有绘制动作并复原所有初始状态。
		 */
		Graphics.prototype.clear = function() {
			this._actions.length = 0;
			this._cache = null;

			this.lineWidth = 1;
			this.strokeStyle = "0";
			this.lineAlpha = 1;
			this.lineCap = null;
			this.lineJoin = null;
			this.miterLimit = 10;
			this.hasStroke = false;

			this.fillStyle = "0";
			this.fillAlpha = 1;
		};

		/** 
		 * 添加一个绘制动作。内部私有方法。
		 * @private
		 */
		Graphics.prototype._addAction = function(action) {
			this._actions.push(action);
			return this;
		};

		/**
		 * @private
		 */
		Graphics._getContext = function() {
			var ctx = Quark.createDOM("canvas").getContext("2d");
			this._getContext = function() {
				return ctx;
			};
			return ctx;
		};

	})();



	(function() {

		/**
		 * 构造函数。
		 * @name Text
		 * @augments DisplayObject
		 * @class Text类提供简单的文字显示功能。
		 * @property text 指定要显示的文本内容。
		 * @property font 指定使用的字体样式。
		 * @property color 指定使用的字体颜色。
		 * @property textAlign 指定文本的对齐方式。可以是以下任意一个值："start", "end", "left", "right", and "center"。
		 * @property outline 指定文本是绘制边框还是填充。
		 * @property maxWidth 指定文本绘制的最大宽度。仅在canvas中使用。
		 * @property lineWidth 指定文本行的最大宽度。
		 * @property lineSpacing 指定文本的行距。单位为像素。
		 * @property fontMetrics 指定字体的度量对象。一般可忽略此属性，可用于提高性能。
		 */
		var Text = Quark.Text = function(props) {
			this.text = "";
			this.font = "12px arial";
			this.color = "#000";
			this.textAlign = "start";
			this.outline = false;
			this.maxWidth = 10000;
			this.lineWidth = null;
			this.lineSpacing = 0;
			this.fontMetrics = null;

			props = props || {};
			Text.superClass.constructor.call(this, props);
			this.id = Quark.UIDUtil.createUID("Text");

			if (this.fontMetrics == null) this.fontMetrics = Text.getFontMetrics(this.font);
		}
		Quark.inherit(Text, Quark.DisplayObject);


		/**
		 * 在指定的渲染上下文上绘制文本。
		 * @private
		 */
		Text.prototype._draw = function(context) {
			if (!this.text || this.text.length == 0) return;

			//set drawing style
			context.font = this.font;
			context.textAlign = this.textAlign;
			context.textBaseline = "top";
			if (this.outline) context.strokeStyle = this.color;
			else context.fillStyle = this.color;

			//find and draw all explicit lines
			var lines = this.text.split(/\r\n|\r|\n|<br(?:[ \/])*>/);
			var y = 0,
				lineHeight = this.fontMetrics.height + this.lineSpacing;
			this.width = this.lineWidth || 0;

			for (var i = 0, len = lines.length; i < len; i++) {
				var line = lines[i],
					width = context.measureText(line).width;

				//check if the line need to split
				if (this.lineWidth == null || width < this.lineWidth) {
					if (width > this.width) this.width = width;
					this._drawTextLine(context, line, y);
					y += lineHeight;
					continue;
				}

				//split the line by each single word, loop to find the break
				//TODO: optimize the regular expression
				var words = line.split(/([^\x00-\xff]|\b)/),
					str = words[0];
				for (var j = 1, wlen = words.length; j < wlen; j++) {
					var word = words[j];
					if (!word || word.length == 0) continue;

					var newWidth = context.measureText(str + word).width;
					if (newWidth > this.lineWidth) {
						this._drawTextLine(context, str, y);
						y += lineHeight;
						str = word;
					} else {
						str += word;
					}
				}

				//draw remaining string
				this._drawTextLine(context, str, y);
				y += lineHeight;
			}

			this.height = y;
		};

		/**
		 * 在指定的渲染上下文上绘制一行文本。
		 * @private
		 */
		Text.prototype._drawTextLine = function(context, text, y) {
			var x = 0;
			switch (this.textAlign) {
				case "center":
					x = this.width * 0.5;
					break;
				case "right":
				case "end":
					x = this.width;
					break;
			};
			if (this.outline) context.strokeText(text, x, y, this.maxWidth);
			else context.fillText(text, x, y, this.maxWidth);
		};

		/**
		 * 指定渲染文本的字体样式。
		 */
		Text.prototype.setFont = function(font, ignoreFontMetrics) {
			if (this.font == font) return;
			this.font = font;
			if (!ignoreFontMetrics) this.fontMetrics = Text.getFontMetrics(this.font);
		};

		/**
		 * Overrideed.
		 * @private
		 */
		Text.prototype.render = function(context) {
			if (context instanceof Quark.DOMContext) {
				var dom = this.getDrawable(context),
					style = dom.style;
				style.font = this.font;
				style.textAlign = this.textAlign;
				style.color = this.color;
				//Notice: be care of width/height might be 0.
				style.width = this.width + "px";
				style.height = this.height + "px";
				style.lineHeight = (this.fontMetrics.height + this.lineSpacing) + "px";
				dom.innerHTML = this.text;
			}
			Text.superClass.render.call(this, context);
		};

		/**
		 * Overrideed.
		 * @private
		 */
		Text.prototype.getDrawable = function(context) {
			//for DOMContext drawing only
			if (this.drawable == null) this.setDrawable(Quark.createDOM("div"), true);
			return this.drawable.get(this, context);
		};

		/**
		 * 此方法可帮助我们得到指定字体的行高、基准线等度量信息。
		 * @method getFontMetrics
		 * @return {Object} 返回字体的度量信息，包括height、ascent、descent等。
		 */
		Text.getFontMetrics = function(font) {
			var metrics = {};
			var elem = Quark.createDOM("div", {
				style: {
					font: font,
					position: "absolute"
				},
				innerHTML: "M"
			});
			document.body.appendChild(elem);
			//the line height of the specific font style.
			metrics.height = elem.offsetHeight;

			//trick: calculate baseline shift by creating 1px height element that will be aligned to baseline.
			elem.innerHTML = '<div style="display:inline-block; width:1px; height:1px;"></div>';
			var baseline = elem.childNodes[0];
			//the ascent value is the length from the baseline to the top of the line height.
			metrics.ascent = baseline.offsetTop + baseline.offsetHeight;
			//the descent value is the length from the baseline to the bottom of the line height.
			metrics.descent = metrics.height - metrics.ascent;

			document.body.removeChild(elem);
			return metrics;
		};


	})();


})();

/*===================filePath:[src/main/motion/motion.js]======================*/
/**
 * @author Brucewan
 * @version 1.0
 * @date 2014-06-13
 * @description tg核心功能
 * @example
		var tab1 = new mo.Tab({
			target: $('#slide01 li')
		}); 
 * @name mo
 * @namespace
 */
(function(){

	(function(){
		
		if(window.Motion) {
			return;
		}

		var Motion = /** @lends mo */{
			/**
			 * tg版本号
			 * @type {string}
			 */
			version: '1.1',

			/**
			 * 命令空间管理 eg. Motion.add('mo.Slide:mo.Tab', function(){})
			 * @param {string} name 
			 * @param {object} obj 
			 */

			add: function(name, obj){
				var target = window;
				var me = arguments.callee;
				var parent = null;
				var isMatch = /^([\w\.]+)(?:\:([\w\.]+))?\s*$/.test(name);
				var objNS = RegExp.$1.split('.');
				var parentNS = RegExp.$2.split('.');
				var name = objNS.pop();
				var isClass = /[A-Z]/.test(name.substr(0,1));
				var constructor = function(){
					var mainFn = arguments.callee.prototype.init;
					if (typeof(mainFn) == 'function' && arguments.callee.caller != me) {
						mainFn && mainFn.apply(this, arguments);
					}
				};

				for(var i = 0; i < objNS.length; i++) {
					var p = objNS[i];
					target = target[p] || (target[p] = {});
				}

				if (parentNS[0] != '') {
					parent = window;
					for (var i = 0; i < parentNS.length; i ++) {
						parent = parent[parentNS[i]];
						if(!parent) {
							parent = null;
							break;
						}
					}
				}


				if(isClass && typeof(obj) == 'function') {
					if(parent) {
						constructor.prototype = new parent();
						constructor.prototype.superClass = parent;
					} 
					target[name] = constructor;
					constructor.prototype.constructor = constructor;
					obj.call(target[name].prototype);
				} else {
					target[name] = obj;
				}

			}

		};

		window.Motion = window.mo = Motion;
	})();

})();

/*===================filePath:[src/main/base/base.js]======================*/
/**
 * @version 1.0
 * @date 2014-06-15
 * @description mo
 * @name mo
 * @namespace
*/

/**
 * @author Brucewan
 * @version 1.0
 * @date 2014-06-18
 * @description 基础类
 * @name mo.Base
 * @class
*/
(function(){
	
	
	Motion.add('mo.Base', function() {
		/**
		 * public 作用域
		 * @alias mo.Base#
		 * @ignore
		 */
		var _public = this;
		/**
		 * public static作用域
		 * @alias mo.Base.
		 * @ignore
		 */
		var _static = this.constructor;
		/**
		 * private static作用域
		 * @alias mo.Base~
		 * @ignore
		 */
		var _self = {};
		/**
		 * 构造函数
		 */
		_public.constructor = function() {
			// private作用域
			var _private = {};
		};


		/**
		 * 绑定事件
		 */
		
		_public.on = function(name, fn) {
			box = Zepto(this);
			return box.on.apply(box, arguments);
		};


		/**
		 * 绑定事件
		 */
		_public.off = function(name, fn) {
			box = Zepto(this);
			return box.off.apply(box, arguments);
		};

		/**
		 * 触发事件
		 */
		_public.trigger = function(name, data) {
			var box = Zepto(this);
			return box.triggerHandler.apply(box, arguments);
		};


	});

})();

/*===================filePath:[src/main/image-editor/image-editor.js]======================*/
/**
 * @author Brucewan
 * @version 1.0
 * @date 2014-07-11
 * @description 图片编辑器
 * @extends mo.Base
 * @name mo.ImageEditor
 * @requires zepto.js
 * @requires base.js
 * @param {zepto object} config.trigger 文件获取控件，如<input type="file" />
 * @param {zepto object} config.container 图片编辑容器
 * @param {number} [config.width=320] 编辑器宽度
 * @param {number} [config.height=320] 编辑器高度
 * @param {object} config.iconScale 缩放图标 eg. {url: 'img/icon.png',rect: [300, 300, 25, 25]}
 * @param {object} config.iconClose 关闭图标 eg. {url: 'img/icon.png',rect: [300, 300, 25, 25]}
 * @see image-editor/demo1.html 图片合成（新窗口或扫描二维码测试）
 * @class
 */
(function(){
	
	
	
	
	
	

	Motion.add('mo.ImageEditor:mo.Base', function() {

		/**
		 * public 作用域
		 * @alias mo.ImageEditor#
		 * @ignore
		 */
		var _public = this;

		var _private = {};

		/**
		 * public static作用域
		 * @alias mo.ImageEditor.
		 * @ignore
		 */
		var _static = this.constructor;



		// 插件默认配置
		_static.config = {
			width: 320,
			height: 320,
			fps: 60
		};


		/***
		 * 初始化
		 * @description 参数处理
		 */
		_public.init = function(config) {
			this.config = Zepto.extend(true, {}, _static.config, config); // 参数接收

			var self = this;
			var config = self.config;

			// 自定义事件绑定
			self.effect && self.on(self.effect);
			config.event && self.on(config.event);

			/**
			 * @event mo.ImageEditor#beforeinit
			 * @property {object} event 开始初始化前
			 */
			if (self.trigger('beforeinit') === false) {
				return;
			}

			// 创建canvas
			var canvas = Quark.createDOM('canvas', {
				id:config.id,
				width: config.width,
				height: config.height,
				style: {
					position: "relative",
					zIndex: 100,
					top: config.offsetTop+'px'
				}
			});
			canvas = $(canvas).appendTo(config.container)[0];

			var context = new Quark.CanvasContext({
				canvas: canvas
			});

			/**
			 * 舞台
			 * @name mo.ImageEditor#stage
			 * @type quark object
			 */
			self.stage = new Quark.Stage({
				width: config.width,
				height: config.height,
				context: context
			});
			self.canvas = canvas;

			/**
			 * canvas context
			 * @name mo.ImageEditor#context
			 * @type  object
			 */
			self.context = context;

			// register stage events
			var em = this.em = new Quark.EventManager();
			em.registerStage(self.stage, ['touchstart', 'touchmove', 'touchend'], true, true);
			self.stage.stageX = config.stageX !== window.undefined ? config.stageX : self.stage.stageX;
			self.stage.stageY = config.stageY !== window.undefined ? config.stageY : self.stage.stageY;

			var timer = new Quark.Timer(1000 / config.fps);
			timer.addListener(self.stage);
			timer.addListener(Quark.Tween);
			timer.start();

			var bg = new Q.Graphics({
				width: config.width,
				height: config.height
			});
			bg.drawRect(0, 0, config.width, config.height).endFill().cache();
			self.stage.addChild(bg)

			_private.attach.call(self);
		};



		_private.attach = function() {
			var self = this;
			var config = self.config;

			config.trigger.on('click', function(e) {

				/**
				 * @event mo.ImageEditor#beforechange
				 * @property {object} event 选择完文件准备读取前
				 */
				self.trigger('beforechange');

				var img = new Image();
				img.onload = function() {
					self.addImage({
						img: img
					});

					/**
					 * @event mo.ImageEditor#change
					 * @property {object} 文件选择完毕时
					 */
					self.trigger('change');
				};
				var result = $(e.target).data('src') || './img/babyq.png';
				img.src = result;
			});


			self.stage.addEventListener('touchstart', function(e) {
				if (self.imgs) {
					for (var i = 0; i < self.imgs.length; i++) {
						self.imgs[i].disable();
					}
				}
				if (e.eventTarget && e.eventTarget.parent.enEditable) {
					e.eventTarget.parent.enEditable();
					self.activeTarget = e.eventTarget.parent;
				}
			});
			self.stage.addEventListener('touchmove', function(e) {
				/*
				var touches = e.rawEvent.touches || e.rawEvent.changedTouches;
				if (e.eventTarget && (e.eventTarget.parent == self.activeTarget) && touches[1]) {
					var dis = Math.sqrt(Math.pow(touches[1].pageX - touches[0].pageX, 2) + Math.pow(touches[1].pageY - touches[0].pageY, 2));
					if (self.activeTarget.mcScale.touchDis) {
						var scale = dis / self.activeTarget.mcScale.touchDis - 1;
						if (self.activeTarget.getCurrentWidth() < 100 && scale < 0) {
							scale = 0;
						}

						self.activeTarget.scaleX += scale;
						self.activeTarget.scaleY += scale;
					}
					self.activeTarget.mcScale.touchDis = dis;
				}
				*/
			});
			self.stage.addEventListener('touchend', function(e) {
				if (self.activeTarget && self.activeTarget.mcScale) {
					delete self.activeTarget.mcScale.touchDis;
				}
			});
		};


		/**
		 * 添加图片
		 * @param {object} page eg.{img: document.querySelector('#img3'), 'disMove': true, disScale: true}
		 */
		_public.addImage = function(info) {
			var self = this;
			var config = self.config;
			var img = info.img;
			var exif = info.exif;
			var imgContainer;
			var mcScale;
			var mcClose;
			var imgWidth = img.width;
			var imgHeight = img.height;
			var imgRotation = 0;
			var imgRegX = 0;
			var imgRegY = 0;
			var imgX = 0;
			var imgY = 0;
			var posX = info.pos ? info.pos[0] : 0;
			var posY = info.pos ? info.pos[1] : 0;
			var imgScale = 1;
			var orientation = exif ? exif.Orientation : 1;
			var getRatio = function(img) {
				if (/png$/i.test(img.src)) {
					return 1;
				}
				var iw = img.naturalWidth,
					ih = img.naturalHeight;
				var canvas = document.createElement('canvas');
				canvas.width = 1;
				canvas.height = ih;
				var ctx = canvas.getContext('2d');
				ctx.drawImage(img, 0, 0);
				var data = ctx.getImageData(0, 0, 1, ih).data;
				var sy = 0;
				var ey = ih;
				var py = ih;
				while (py > sy) {
					var alpha = data[(py - 1) * 4 + 3];
					if (alpha === 0) {
						ey = py;
					} else {
						sy = py;
					}
					py = (ey + sy) >> 1;
				}
				var ratio = (py / ih);
				return (ratio === 0) ? 1 : ratio;
			}
			var ratio = getRatio(img);

			this.clear();

			if (typeof img == 'string') {
				var url = img;
				img = new Image();
				img.src = url;
			}

			// 判断拍照设备持有方向调整照片角度
			// switch (orientation) {
			// 	case 3:
			// 		imgRotation = 180;
			// 		imgRegX = imgWidth;
			// 		imgRegY = imgHeight * ratio;
			// 		// imgRegY -= imgWidth * (1-ratio);
			// 		break;
			// 	case 6:

			// 		imgRotation = 90;
			// 		imgWidth = img.height;
			// 		imgHeight = img.width;
			// 		imgRegY = imgWidth * ratio;
			// 		// imgRegY -= imgWidth * (1-ratio);
			// 		break;
			// 	case 8:
			// 		imgRotation = 270;
			// 		imgWidth = img.height;
			// 		imgHeight = img.width;
			// 		imgRegX = imgHeight * ratio;

			// 		if (/iphone|ipod|ipad/i.test(navigator.userAgent)) {
			// 			alert('苹果系统下暂不支持你以这么萌！萌！达！姿势拍照！');
			// 			return;
			// 		}
			// 		break;
			// }
			imgWidth *= ratio;
			imgHeight *= ratio;

			if (imgWidth > self.stage.width) {
				imgScale = self.stage.width / imgWidth;
			}

			imgWidth = imgWidth * imgScale;
			imgHeight = imgHeight * imgScale;

			imgContainer = new Quark.DisplayObjectContainer({
				width: imgWidth,
				height: imgHeight
			});
			imgContainer.x = posX;
			imgContainer.y = posY;

			img = new Quark.Bitmap({
				image: img,
				regX: imgRegX,
				regY: imgRegY
			});
			img.rotation = imgRotation;
			img.x = imgX;
			img.y = 0;
			img.scaleX = imgScale * ratio;
			img.scaleY = imgScale;

			// 取消选中边框
			// var border = new Q.Graphics({
			// 	width: imgWidth + 10,
			// 	height: imgHeight + 10,
			// 	x: -5,
			// 	y: -5
			// });
			// border.lineStyle(5, "#aaa").beginFill("#fff").drawRect(5, 5, imgWidth, imgHeight).endFill().cache();
			// border.alpha = 0.5;
			// border.visible = false;
			// imgContainer.addChild(border);

			if (config.iconClose) {
				var iconCloseImg = new Image();
				iconCloseImg.onload = function() {
					var rect = config.iconClose.rect;
					mcClose = new Quark.MovieClip({
						image: iconCloseImg
					});
					mcClose.addFrame([{
						rect: rect
					}]);
					mcClose.x = 0;
					mcClose.y = 0;
					mcClose.alpha = 0.5;
					mcClose.visible = false;
					mcClose.addEventListener('touchstart', function(e) {
						mcClose.alpha = 0.8;
					});
					mcClose.addEventListener('touchend', function(e) {
						self.stage.removeChild(imgContainer);
					});
					self.stage.addEventListener('touchend', function(e) {
						mcClose.alpha = 0.5;
					});
					imgContainer.addChild(mcClose);
				};
				iconCloseImg.src = config.iconClose.url;
			}


			if (!info.disable) {

				img.fnStart = function(e){
					//console.log("MimgContainer:("+imgContainer.x+":"+imgContainer.y+")——("+imgContainer.regX+":"+imgContainer.regY+") scale:"+imgContainer.scaleX);
					var isMultiTouch = e.rawEvent && e.rawEvent.touches[1];

					if(!isMultiTouch){
						// 记录单指
						img.curW = imgContainer.getCurrentWidth();
						img.curH = imgContainer.getCurrentHeight();
						img.moveabled = true;
						img.touchStart = [{
							'x': e.eventX,
							'y': e.eventY
						}];
						delete img.startScaleDistance;
					}else{
						// 记录两指
						var touch1 = e.rawEvent.touches[0];
						var touch2 = e.rawEvent.touches[1];
						img.startScaleDistance = Math.sqrt(Math.pow(touch2.pageX - touch1.pageX, 2) + Math.pow(touch2.pageY - touch1.pageY, 2));
						img.touchStart = [{
							'x': touch1.pageX,
							'y': touch1.pageY
						},
						{
							'x': touch2.pageX,
							'y': touch2.pageY
						}];
						// 专供双指旋转使用的，不会被fnMove改变值
						img.touchStartScale = [{
							'x': touch1.pageX,
							'y': touch1.pageY
						},
						{
							'x': touch2.pageX,
							'y': touch2.pageY
						}];
						img.imgContainerStartRotation = imgContainer.rotation;

						/* 核心功能：将imgContainer的reg坐标放到双指中间，以支持按双指中心移动缩放旋转的效果 start */

						// 1.计算触控中心点，在屏幕中的位置
						var touches = img.touchStart;
						var nCenterPoint = {'x':0, 'y':0};
						for (var i = 0; i < touches.length; i++) {
							nCenterPoint.x += touches[i].x
							nCenterPoint.y += touches[i].y;
						};
						nCenterPoint.x /= touches.length;
						nCenterPoint.y /= touches.length;

						// 2.触控中心点，在canvas中的位置
						nCenterPoint.x -= self.canvas.offsetLeft;
						nCenterPoint.y -= self.canvas.offsetTop;

						// 3.计算图片左上角在canvas中的位置
						var leftUpPiont = {'x':0, 'y':0};
						var dc = Math.sqrt( Math.pow(imgContainer.regX * imgContainer.scaleX, 2) + Math.pow(imgContainer.regY * imgContainer.scaleY, 2) );
						var r = Math.atan2(imgContainer.regY, imgContainer.regX);
						r = 180 / Math.PI * r;
						leftUpPiont.x = imgContainer.x - Math.cos( Math.PI * (imgContainer.rotation + r) / 180 ) * dc;
						leftUpPiont.y = imgContainer.y - Math.sin( Math.PI * (imgContainer.rotation + r) / 180 ) * dc;

						// 4.触控中心点，离左上角中的距离
						nCenterPoint.x -= leftUpPiont.x;
						nCenterPoint.y -= leftUpPiont.y;

						// 移动reg坐标到中心点这里，计算触控中心点相当于图片的内部坐标
						var dc = Math.sqrt( Math.pow(nCenterPoint.x, 2) + Math.pow(nCenterPoint.y, 2) );
						var r = Math.atan2(nCenterPoint.y, nCenterPoint.x);
						r = 180 / Math.PI * r;						
						var newRegX = dc * Math.cos( Math.PI * (r - imgContainer.rotation ) / 180) / imgContainer.scaleX;
						var newRegY = dc * Math.sin( Math.PI * (r - imgContainer.rotation ) / 180) / imgContainer.scaleY;
						//console.log("nc("+nCenterPoint.x+", "+nCenterPoint.y+") r:"+r+" ir:"+imgContainer.rotation);

						// 将 imgContainer 的 regx 移动到触控中心
						var dx = newRegX - imgContainer.regX;
						var dy = newRegY - imgContainer.regY;
						imgContainer.regX += dx;
						imgContainer.regY += dy;

						// 反向移动一下imgContainer的x和y，以保证图片不会跳动
						var dc = Math.sqrt( Math.pow(dx, 2) + Math.pow(dy, 2) ) ;
						var r = Math.atan2(dy, dx);
						r = 180 / Math.PI * r;
						imgContainer.x += dc * Math.cos(Math.PI * (imgContainer.rotation + r) / 180) * imgContainer.scaleX;
						imgContainer.y += dc * Math.sin(Math.PI * (imgContainer.rotation + r) / 180) * imgContainer.scaleY;
						//console.log("dx("+dx+", "+dy+")");

						/* 核心功能：将imgContainer的reg坐标放到双指中间，以支持按双指中心移动缩放旋转的效果 end */

					}
				};
				
				img.fnMove = function(e){

					// 检测记录当前触控信息
					// 1.记录触控坐标的数组
					var touches = [];
					// 2.是否多指
					var isMultiTouch = img.touchStart.length > 1 ? true : false;
					if(!isMultiTouch){
						touches = [{
							'x': e.eventX,
							'y': e.eventY
						}];
					}else{
						touches = [{
							'x': e.rawEvent.touches[0].pageX,
							'y': e.rawEvent.touches[0].pageY
						},
						{
							'x': e.rawEvent.touches[1].pageX,
							'y': e.rawEvent.touches[1].pageY
						}];
					}

					// 以下是三个支持多指操作的功能，缩放，移动，旋转
					// 双指缩放图片
					if(!info.disScale && isMultiTouch){
						
						var dis = Math.sqrt(Math.pow(touches[1].x - touches[0].x, 2) + Math.pow(touches[1].y - touches[0].y, 2));
						if (img.startScaleDistance) {
							//console.log("s:"+img.startScaleDistance+"n:"+dis+"x:"+img.scaleX+"y:"+img.scaleY);
							var newScale = dis * imgContainer.scaleX / img.startScaleDistance;
							imgContainer.scaleX = newScale;
							imgContainer.scaleY = newScale;
							
						}
						img.startScaleDistance = dis;
					}

					// 移动图片
					if(!info.disMove && img.moveabled){
						// 将所有触点的移动距离加起来
						var disX = 0, disY = 0;
						for (var i = 0; i < touches.length; i++) {
							disX += touches[i].x - img.touchStart[i].x;
							disY += touches[i].y - img.touchStart[i].y;
						};
						disX = disX / touches.length;
						disY = disY / touches.length;


					//	// 限制移动范围
					//	var setX = imgContainer.x + disX;
					//	var setY = imgContainer.y + disY;
					
					//
					//	if (setX < -img.curW / 2 + 5 && disX < 0) {
					//		setX = -img.curW / 2;
					//	}
					//	if (setY < -img.curH / 2 + 5 && disY < 0) {
					//		setY = -img.curH / 2;
					//	}
					//	if (setX > -img.curW / 2 + self.stage.width - 5 && disX > 0) {
					//		setX = self.stage.width - img.curW / 2;
					//	}
					//	if (setY > self.stage.height - 5 && disY > 0) {
					//		setY = self.stage.height;
					//	}

						imgContainer.x += disX;
						imgContainer.y += disY;

						//console.log(disX+":"+disY);
						//console.log(img.touchStart[0].x+":"+img.touchStart[0].y);
						//console.log(touches[0].x+":"+touches[0].y);

						img.touchStart = touches;
					}


					// 双指旋转图片
					if(isMultiTouch){

						// 1.计算起始双指的角度
						var dx = img.touchStartScale[1].x - img.touchStartScale[0].x;
						var dy = img.touchStartScale[1].y - img.touchStartScale[0].y;
						var r1 = Math.atan2(dy, dx);
						r1 = 180 / Math.PI * r1;

						// 2.计算此时的双指角度
						var dx = touches[1].x - touches[0].x;
						var dy = touches[1].y - touches[0].y;
						var r2 = Math.atan2(dy, dx);
						r2 = 180 / Math.PI * r2;

						// 3.done!
						imgContainer.rotation = img.imgContainerStartRotation + r2 - r1;
						//console.log("r1:"+r1+" r2:"+r2);

					}

				};


				img.fnEnd = function(e){
					img.moveabled = false;
					/*
					 * 此处也要记录，是避免此种情况：
					 * 1指按住的同时，2指离开，此时只会触发touchend，不会触发touchstart
					 * 所以touchend也需要更新为单指，否则再移动程序会以为还是双指。
					 */
					var isMultiTouch = e.rawEvent && e.rawEvent.touches[1];

					if(!isMultiTouch){
						// 记录单指
						img.curW = imgContainer.getCurrentWidth();
						img.curH = imgContainer.getCurrentHeight();
						img.moveabled = true;
						img.touchStart = [{
							'x': e.eventX,
							'y': e.eventY
						}];
						delete img.startScaleDistance;
					}else{
						// 记录两指
						var touch1 = e.rawEvent.touches[0];
						var touch2 = e.rawEvent.touches[1];
						img.startScaleDistance = Math.sqrt(Math.pow(touch2.pageX - touch1.pageX, 2) + Math.pow(touch2.pageY - touch1.pageY, 2));
						img.touchStart = [{
							'x': touch1.pageX,
							'y': touch1.pageY
						},
						{
							'x': touch2.pageX,
							'y': touch2.pageY
						}];

					}
					
				};

				img.addEventListener('touchstart', function(e) {
					img.fnStart(e);
				});
				img.addEventListener('touchmove', function(e) {
					img.fnMove(e);
				});
				img.addEventListener('touchend', function(e) {
					img.fnEnd(e);
				});
			}


			imgContainer.enEditable = function() {
				if (info.disable) {
					return;
				}
				// border.visible = true;
				/*
				if (mcScale) {
					mcScale.visible = true;
				}
				*/
				if (mcClose) {
					mcClose.visible = true;
				}
			}
			imgContainer.disable = function() {
				// border.visible = false;
				/*
				if (mcScale) {
					mcScale.visible = false;
				}
				*/
				if (mcClose) {
					mcClose.visible = false;
				}
			}


			img.update = function() {
				if (imgContainer && imgContainer.scaleX) {
					/*
					if (mcScale && mcScale.scaleX) {
						mcScale.scaleX = 1 / imgContainer.scaleX;
						mcScale.scaleY = 1 / imgContainer.scaleY;
						mcScale.x = border.getCurrentWidth() - 10 - mcScale.getCurrentWidth();
					}
					*/
					if (mcClose && mcClose.scaleX) {
						mcClose.scaleX = 1 / imgContainer.scaleX;
						mcClose.scaleY = 1 / imgContainer.scaleY;
						mcClose.x = 0;
					}
				}

			}

			// imgContainer.rotation = 10;
			imgContainer.addChild(img);
			self.stage.update = function() {
				// console.log(0)
				// img.rotation  ++;
			}
			imgContainer.update = function() {
				//this.rotation  ++;
			}
			self.stage.addChild(imgContainer);

			/**
			 * 所有图片对象
			 * @name mo.ImageEditor#imgs
			 * @type  array
			 */
			if (self.imgs) {
				self.imgs.push(imgContainer);
			} else {
				self.imgs = [imgContainer];
			}
			return imgContainer;
		};

		/**
		 * 清除画布
		 */
		_public.clear = function() {
			if (this.imgs) {
				for (var i = 0; i < this.imgs.length; i++) {
					this.stage.removeChild(this.imgs[i]);
				}
			}
		};

		/**
		 * 画布失去焦点
		 */
		_public.unSelect = function() {
			var imgs = this.imgs;
			if (imgs) {
				for (var i = 0; i < imgs.length; i++) {
					imgs[i].disable();
				}
			}
		};

		/**
		 * 导出base64数据
		 */
		_public.toDataURL  = function(callback) {
			var self = this;

			// 去除编辑状态的元素
			self.unSelect();

			// 已测手机QQ浏览器canvas.toDataURL有问题，使用jeegEncoder
			window.setTimeout(function() {
				var  encoder  =  new  JPEGEncoder();
				var data =  encoder.encode(self.canvas.getContext('2d').getImageData(0, 0, self.stage.width, self.stage.height),  90);
				callback.call(self, data);
			}, 1000 / self.config.fps)
		}
	});

})();