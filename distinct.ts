// JavaScript program to remove duplicate character
// from character array and print in sorted
// order
function removeDuplicate(str, n)
	{
		// Used as index in the modified string
		var index = 0;

		// Traverse through all characters
		for (var i = 0; i < n; i++)
		{

			// Check if str[i] is present before it 
			var j;
			for (j = 0; j < i; j++) 
			{
				if (str[i] == str[j])
				{
					break;
				}
			}

			// If not present, then add it to
			// result.
			if (j == i) 
			{
				str[index++] = str[i];
			}
		}
		
		return str.join("").slice(str, index);
	}

  let str =
  "*/**$*+&$$@*+@***/****#$#$%+***&*%**$=*#***+&****%*=$*/*&=@****#*%*&@%&$/**$#*/%**+=**-**@**%*@**#+*&&=*/=%*@*+=*&****$&*@*%%=-*-*****#*****@*-**%****$%=#*%*@%#$**&*=+*****@+$*+&****+%***/*/*&***-*=/%***/*@*/@*******=/**$++/**%****=*/**=-#%**#***&***&***=***@/$#/-@*+**=**-*-*/%***&*@**%@+**=*+#$@=***&**-/******&*%/**/$$*****&/%***@+*##&+*$*$$*@**%=*&*#*=*@*-@*&%*@**+/***-**-*&+@+@+-***@****&&+=***&-****%*=&**/##**+=*******--##/**&$=*+@*******%***/***%%&*****&//=****/*#*****/***@**@%+@&$*@*%*=*+**/**@/*****#=******#*-%/*&$****#*/*+=***@***/****/&*$**-**#*@@+-**@%=&**#@&@@=*$****-*@*$&*-****&-&**-**=$%==**@##&*/******-+**%***%*+/****/*$*&#*+*@#+$*-*-$&%/-*=*@**@***/*@&**+**/#*/*#$****/***+/*#***/*-*#**+#***/@&@-&**$+*##$@***&*****#*-";


	// Driver code
		var strArray = str.split("");
		var n = strArray.length;
		console.log(removeDuplicate(strArray, n));
	
// This code is contributed by shivanisinghss2110

