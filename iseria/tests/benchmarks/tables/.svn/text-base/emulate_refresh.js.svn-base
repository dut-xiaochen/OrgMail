function refresh_rw( change_row )
{
    var childs = document.getElementById('emu_tbl').childNodes;
    var memo = document.getElementById('memo');

    //  relation between  childnodes and row_index;
    //  emu_tbl.childnodes[0] -> row_div


    var row_max = 50;
    var clm_max = 20;

    var startTime = new Date()

    for ( var r = 0 ; r < row_max ; r++ ){

//	alert ( childs[ ( r * 2 ) + 1 ].innerHTML );
	var replace;
	
	replace = "";
	for ( var c = 0 ; c < clm_max ; c++ ){
	    replace += "<span class='c" + c + "'>" + cell_data[ r ][ c+1  ] + "</span>" ;
	}
//	alert ( replace );
	childs[ ( r * 2 ) + 1 ].innerHTML = replace;
	

//	alert ( childs[ ( r * 2 + 1 ) ].innerHTML );
/*
	childs[ ( r * 2 ) + 1 ].innerHTML = "<span class='c0'>bbbbb</span>";
	childs[ ( r * 2 ) + 1 ].innerHTML += "<span class='c1'>会い植え終え終え終え終え終え終えおえおえおえおえおえおえおえおええおえおえおえおえおえ</span>";
	childs[ ( r * 2 ) + 1 ].innerHTML += "<span class='c2'>dowieu</span>";
	childs[ ( r * 2 ) + 1 ].innerHTML += "<span class='c3'>deew</span>";
*/

//	memo.innerHTML += ( childs[e] + " : " + childs[ e ].innerHTML + "<Br>\n");
//	memo.innerHTML += childs[e].className + "<br>";

/*
	if ( ( e % 2 ) == 0 ){
	    memo.innerHTML += childs[ e ] + " : " + childs[ e ].innerHTML + "<br>";
	}
*/

    }

    var doneTime = new Date();
    logger.log( "change :" + time_diff( startTime, doneTime ) + "ms " );

}






