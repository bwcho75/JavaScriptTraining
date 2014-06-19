/**
 * Created by bw.cho on 2014-06-18.
 */
var Widget = function() {
    var self = this;
    this.daum_apikey = 'e960a8d605f66a6f7a75a4c2f411a32ce91539b4';
    this.requestKeyword();
    this.selectedKeywordIndex = 0;
    this.items ={};
    this.indexer = 0; // pointer in the current items

    // click event binding
    $('#keywordContainer').on('click','._keyword', $.proxy(function(e){
        e.preventDefault();
        var index = $(e.currentTarget).attr('data-index');
        self.selectKeyword(index);
    },this));

    // right button binding
    $('.next').on('click',function(e){
        e.preventDefault();
        self.moveright(self);
    });

    $('.prev').on('click',function(e){
        e.preventDefault();
        self.moveleft(self);
    });

};

/** tag replacer
/*  replace &lt; to <
/*  replate &rt: to >
 */
Widget.prototype.tagReplace=function(str){
    return str.replace(/(&gt;)/g,">").replace(/(&lt;)/g,"<").replace(/(&quot;)/g,'"');
}

/** <B> tag remover
 */
Widget.prototype.removeBTag=function(str){
    return str.replace('<b>','','g').replace('</b>','','g');
}

/**  select keyword event
 *
 * @param index
 */
Widget.prototype.selectKeyword = function(index,move_indexer_toend){
    var self = this;
    index = Number(index);

    $('.item_list li[data-index='+self.selectedKeywordIndex+']').removeClass('selected');
    $('.item_list li[data-index='+index+']').addClass('selected');
    self.selectedKeywordIndex = index; // previous selected index
    self.indexer = 0;
    var keyword = $('.item_list li[data-index='+index+']').text();
    //console.log('index :'+index+' keyword:'+keyword);

    self.search(keyword,move_indexer_toend);
};

/** displayItem
 * display selected news in a keyword
 * in a keyword, it has 10 news contents are cached in items list
 * this function displays selected news by index(selector)
 * @param index
 * @param self
 */
Widget.prototype.displayItem = function(index,self){
    var item = self.items.item[index];

    // retrieve data and manuplate
    var title = item.title.toString();
    title = self.tagReplace(title);
    title = self.removeBTag(title);
    title = title.length > 15 ? title.substr(0,15)+'..':title;

    var description = self.tagReplace(item.description);
    var url = item.link;
    var pubDate = item.pubDate.toString().split(' ')[0];

    // apply values to screen
    $('#title').html(title);
    $('#title').attr('href',url);
    $('#pubDate').text(pubDate);
    $('#description').html(description);

}

/**
 * search
 * Call daum search API with search keyword.
 * searched results (news) are cahced in "items" variable
 * @param keyword : search keyword
 */
Widget.prototype.search = function(keyword,move_indexer_toend){
    var self = this;
    var url = 'http://apis.daum.net/search/web';
    url+= '?q='+keyword;
    url+= '&output=json';
    url+= '&apikey='+self.daum_apikey;

    $.ajax({
        url:url,
        dataType:'jsonp',
        jsonp:'callback',
        success:function(data){
            // parse json response
            self.items = data.channel;
            console.log('items');
            console.log(url);
            console.log(self.items);
            var p = 0;

            if(move_indexer_toend == true){
                p = Number(self.items.result)-1;
                self.indexer=p;
            }

            self.displayItem(p,self);
        }
    });
}

/** requestKeyword
 * request news keyword from Daum by using socialPick API
 */
Widget.prototype.requestKeyword = function(){
    var self = this;
    var $keywordContainer = $('#keywordContainer');
    $.ajax({
        url:'http://apis.daum.net/socialpick/search?output=json',
        dataType:'jsonp',
        jsonp:'callback',
        success:function(data){

            var output='';
            var rep;
            for(var i= 0,l=Math.min(5,data.socialpick.item.length);i<l;i++){
                var keyword= data.socialpick.item[i].keyword;
                rep = self._getTemplate('tpl_item',{
                    keyword:keyword,
                    index:i
                });
               output+=rep;

            }// for
            $keywordContainer.html(output);
            self.selectKeyword(0);

        }
    });
};
/**
 * moveleft
 * event handler for "left" button
 * @param self
 */
Widget.prototype.moveleft = function(self){
    if (self.indexer > 0) {
        self.indexer--;
        self.displayItem(self.indexer,self);
    }else self.moveup(self);

}

/**
 * moveleft
 * event handler for "left" button
 * @param self
 */
Widget.prototype.moveup = function(self){
    var index = $('.selected').attr('data-index');

    index--;
    //self.indexer=10;
    if(index<0){
        index=4;
    }
    self.selectKeyword(index,true);

}

/**
 * moveright
 * event handler for 'right' button
 * @param self
 */
Widget.prototype.moveright = function(self){
    if (self.indexer < Number(self.items.result)-1 ){
        self.indexer++;
        self.displayItem(self.indexer,self);
    }
    else {
        self.movedown(self);
        return;
    }
    //alert(self.indexer);

}

/**
 * movedown
 * event handler for 'right' button
 * @param self
 */
Widget.prototype.movedown = function(self){

    var index = $('.selected').attr('data-index');

    index++;
    if(index>4){
        index=0;
    }
    self.selectKeyword(index);
    // self.indexer = 0;
    //  self.displayItem(self.indexer,self);
}

/**
 * _getTemplate
 * convert string
 * @param id
 * @param values
 * @returns {XML|string|void|jQuery}
 * @private
 */
Widget.prototype._getTemplate = function(id,values){
    return $('#'+id).text().replace(/{{([^}]+)}}/g,function(text,matchedText){

        return values && typeof values[matchedText] !== 'undefined' ? values[matchedText] : '';
    });
};

