/**
 * Created by bw.cho on 2014-06-18.
 */
var Widget = function() {
    var self = this;
    this.requestKeyword();
    //this.self = this;
    //this.selectKeyword(1);
    this.selectedKeywordIndex = 0;

    $('#keywordContainer').on('click','._keyword', $.proxy(function(e){
        e.preventDefault();
        console.log($(e.currentTarget));
        var index = $(e.currentTarget).attr('data-index');
        console.log('index :'+index);
        self.selectKeyword(index);
        //alert('1');
        //console.log(e);
        //e.secElement.addClass('selected');
    },this));
};

Widget.prototype.selectKeyword = function(index){
    //var self = this;
    console.log('SELF');
    console.log(self);
    console.log('This');
    console.log(this);
    $('.item_list li[data-index='+self.selectedKeywordIndex+']').removeClass('selected');
    $('.item_list li[data-index='+index+']').addClass('selected');
    selectedKeywordIndex = index;
};
Widget.prototype.requestKeyword = function(){
    var self = this;
    var $keywordContainer = $('#keywordContainer');
    $.ajax({
        url:'http://apis.daum.net/socialpick/search?output=json',
        dataType:'jsonp',
        jsonp:'callback',
        success:function(data){
            console.log(data);
            var output='';
            var rep;
            for(var i= 0,l=Math.min(5,data.socialpick.item.length);i<l;i++){
                var keyword= data.socialpick.item[i].keyword;
                rep = self._getTemplate('tpl_item',{
                    keyword:keyword,
                    index:i
                });
               // console.log('rep'+rep);
                output+=rep;

            }// for
            $keywordContainer.html(output);
            self.selectKeyword(1);

        }
    });

    //console.log('OUT:'+output);
};

Widget.prototype._getTemplate = function(id,values){
    return $('#'+id).text().replace(/{{([^}]+)}}/g,function(text,matchedText){
       // console.log(arguments); // for debug
        return values && typeof values[matchedText] !== 'undefined' ? values[matchedText] : '';
    });
};

