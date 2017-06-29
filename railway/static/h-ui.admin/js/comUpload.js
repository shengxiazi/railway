//(function ($) {
//    // 当domReady的时候开始初始化
//    $(function() {
        // 检测是否已经安装flash，检测flash的版本
        var flashVersion = ( function() {
                var version;

                try {
                    version = navigator.plugins[ 'Shockwave Flash' ];
                    version = version.description;
                } catch ( ex ) {
                    try {
                        version = new ActiveXObject('ShockwaveFlash.ShockwaveFlash')
                            .GetVariable('$version');
                    } catch ( ex2 ) {
                        version = '0.0';
                    }
                }
                version = version.match( /\d+/g );
                return parseFloat( version[ 0 ] + '.' + version[ 1 ], 10 );
            } )(),

            supportTransition = (function(){
                var s = document.createElement('p').style,
                    r = 'transition' in s ||
                        'WebkitTransition' in s ||
                        'MozTransition' in s ||
                        'msTransition' in s ||
                        'OTransition' in s;
                s = null;
                return r;
            })();
        var $wrap = $('#uploader');
        var $wrap2 = $('#uploader2');
        var $wrap3 = $('#uploader3');
        if ( !WebUploader.Uploader.support('flash') && WebUploader.browser.ie ) {

            // flash 安装了但是版本过低。
            if (flashVersion) {
                (function(container) {
                    window['expressinstallcallback'] = function( state ) {
                        switch(state) {
                            case 'Download.Cancelled':
                                alert('您取消了更新！')
                                break;

                            case 'Download.Failed':
                                alert('安装失败')
                                break;

                            default:
                                alert('安装已成功，请刷新！');
                                break;
                        }
                        delete window['expressinstallcallback'];
                    };

                    var swf = './expressInstall.swf';
                    // insert flash object
                    var html = '<object type="application/' +
                        'x-shockwave-flash" data="' +  swf + '" ';

                    if (WebUploader.browser.ie) {
                        html += 'classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" ';
                    }

                    html += 'width="100%" height="100%" style="outline:0">'  +
                        '<param name="movie" value="' + swf + '" />' +
                        '<param name="wmode" value="transparent" />' +
                        '<param name="allowscriptaccess" value="always" />' +
                        '</object>';

                    container.html(html);

                })($wrap, $wrap2, $wrap3);

                // 压根就没有安转。
            } else {
                $wrap.html('<a href="http://www.adobe.com/go/getflashplayer" target="_blank" border="0"><img alt="get flash player" src="http://www.adobe.com/macromedia/style_guide/images/160x41_Get_Flash_Player.jpg" /></a>');
                $wrap2.html('<a href="http://www.adobe.com/go/getflashplayer" target="_blank" border="0"><img alt="get flash player" src="http://www.adobe.com/macromedia/style_guide/images/160x41_Get_Flash_Player.jpg" /></a>');
                $wrap3.html('<a href="http://www.adobe.com/go/getflashplayer" target="_blank" border="0"><img alt="get flash player" src="http://www.adobe.com/macromedia/style_guide/images/160x41_Get_Flash_Player.jpg" /></a>');
            }

            //return;
        } else if (!WebUploader.Uploader.support()) {
            alert( 'Web Uploader 不支持您的浏览器！');
            //return;
        }
        var uploader1 = WebUploader.create({

            // swf文件路径
            swf: '../lib/webuploader/0.1.5/Uploader.swf',
            auto: true,
            // 文件接收服务端。
            server: '/api/v1/res',
            //文件上传方式
            method: "POST",
            duplicate:false,//是否可重复选择同一文件
            fileNumLimit: 1,
            compress: null,//图片不压缩
            threads:1,//上传并发数。允许同时最大上传进程数。
            accept: {
                title: 'pdf',
                extensions: 'pdf',
                mimeTypes: '.pdf'
            },
            // 选择文件的按钮。可选。
            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
            pick : {
                id : '#picker1',
                multiple: false
            },

            // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
            resize: false
        });

        var uploader2 = WebUploader.create({

            // swf文件路径
            swf: '../lib/webuploader/0.1.5/Uploader.swf',
            auto: true,
            // 文件接收服务端。
            server: '/api/v1/res',
            //文件上传方式
            method: "POST",
            duplicate:false,//是否可重复选择同一文件
            fileNumLimit: 1,
            accept: {
                title: 'pdf',
                extensions: 'pdf',
                mimeTypes: '.pdf'
            },
            compress: null,//图片不压缩
            threads:1,//上传并发数。允许同时最大上传进程数。
            // 选择文件的按钮。可选。
            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
            pick : {
                id : '#picker2',
                multiple: false
            },
            // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
            resize: false
        });

        var uploader3 = WebUploader.create({
            auto: true,
            // swf文件路径
            swf: '../lib/webuploader/0.1.5/Uploader.swf',
            //文件上传方式
            method: "POST",

            // 文件接收服务端。
            server: '/api/v1/res',
            accept: {
                title: 'Images',
                extensions: 'jpg',
                mimeTypes: '.jpg'
            },
            // 选择文件的按钮。可选。
            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
            pick : {
                id : '#picker3',
                multiple: false
            },

            // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
            resize: false,
            fileNumLimit: 1,
            duplicate:false,//是否可重复选择同一文件

            compress: null,//图片不压缩
            threads:1,//上传并发数。允许同时最大上传进程数。
            // 禁掉全局的拖拽功能。这样不会出现图片拖进页面的时候，把图片打开。
            disableGlobalDnd: true
        });

        function  resetUploaders() {
            resetUploader('picker1','thelist1','geologyDoc',uploader1);
            resetUploader('picker2','thelist2','projectDoc',uploader2);
            resetUploader('picker3','thelist3','pileDoc',uploader3);
        }

        uploader1.onFileQueued = function( file ) {
            $queue = $( '<ul class="filelist"></ul>' ).appendTo($('#thelist1') );
            addFile( file ,$queue,uploader1,'geologyDoc','thelist1','picker1');
        };

        uploader1.onFileDequeued = function( file ) {

            removeFile( file );

        };

        uploader2.onFileQueued = function( file ) {
            $queue = $( '<ul class="filelist"></ul>' ).appendTo($('#thelist2') );
            addFile( file ,$queue,uploader2,'projectDoc','thelist2','picker2');
        };

        uploader2.onFileDequeued = function( file ) {

            removeFile( file );

        };

        uploader3.onFileQueued = function( file ) {
            $queue = $( '<ul class="filelist"></ul>' ).appendTo($('#thelist3') );
            addFile( file ,$queue,uploader3,'pileDoc','thelist3','picker3');
        };

        uploader3.onFileDequeued = function( file ) {
            removeFile( file );
        };



        // 当有文件添加进来时执行，负责view的创建
        function addFile( file ,$queue,uploader,code ,thelist,picker) {

            $("#"+picker).hide();
            $("#"+thelist).show();
            var nameArr=file.name.split(".");
            var name=nameArr[0].substr(0, 2)+'.'+nameArr[1];
            var liClassName = getFileTypeClassName(file.name.split(".").pop());

            var $li = $( '<li id="' + file.id + '">' +
                    '<image class="' + liClassName + '"  height="41"  width="30"></image>' +
                    '<span class="info">' +name + '</span>'+
                    '<p class="progress"><span></span></p>' +
                    '</li>' ),

                $btns = $('<div class="file-panel">' +
                    '<span title="删除" class="cancel">删除</span>'+
                    '<span title="查看" class="view">查看</span>' +
                    '</div>').appendTo( $li ),
                $prgress = $li.find('p.progress span'),
                //$wrap = $li.find( 'p.imgWrap' ),
                $info = $('<p class="error"></p>'),

                showError = function( code ) {
                    switch( code ) {
                        case 'exceed_size':
                            text = '文件过大';
                            break;

                        case 'interrupt':
                            text = '上传暂停';
                            break;

                        default:
                            text = '上传失败';
                            break;
                    }

                    $info.text( text ).appendTo( $li );
                };

            if ( file.getStatus() === 'invalid' ) {
                showError( file.statusText );
            }

            file.on('statuschange', function( cur, prev ) {
                if ( prev === 'progress' ) {
                    $prgress.hide().width(0);
                } else if ( prev === 'queued' ) {
                    //$li.off( 'mouseenter mouseleave' );
                    //$btns.remove();
                }

                // 成功
                if ( cur === 'error' || cur === 'invalid' ) {
                    console.log( file.statusText );
                    showError( file.statusText );

                } else if ( cur === 'interrupt' ) {
                    showError( 'interrupt' );
                } else if ( cur === 'queued' ) {

                } else if ( cur === 'progress' ) {
                    $info.remove();
                    $prgress.css('display', 'block');
                } else if ( cur === 'complete' ) {
                    $li.append( '<span class="success"></span>' );
                }

                $li.removeClass( 'state-' + prev ).addClass( 'state-' + cur );
            });

            $li.on( 'mouseenter', function() {
                $btns.stop().animate({height: 30});
            });

            $li.on( 'mouseleave', function() {
                $btns.stop().animate({height: 0});
            });

            $btns.on( 'click', 'span', function() {
                var index = $(this).index(),
                    deg;
                switch ( index ) {
                    case 0:
                        $("#"+picker).show();
                        $("#"+thelist).hide();
                        $("#"+code).val('');
                        uploader.removeFile( file );
                        return;


                    case 1:
                        viewFile(code);
                        return;


                }
            });

            $li.appendTo( $queue );
        }
        function viewFile(code){
            var fileCode=$("#"+code).val();
            //用code取文档和图片 ajax处理 待完成
            var url='/api/v1/res/'+fileCode+'?'+Math.random();

            layer_open('文件预览',url,'90%','98%');
        }

        function  resetUploader(picker,thelist,code,uploader){
            $("#"+picker).show();
            $("#"+thelist).hide();
            $("#"+code).val('');
            uploader.reset();
            uploader.refresh();
            $("#"+thelist).html('');
        }

        // 负责view的销毁
        function removeFile( file ) {
            var $li = $('#'+file.id);
//
//            delete percentages[ file.id ];
            $li.off().find('.file-panel').off().end().remove();
        }

        // 判断文件出错
        uploader1.onError = function( code ) {
            var msg;
            msg=errorReturn(code);
            layer.alert(msg);
        };
        // 判断文件出错
        uploader2.onError = function( code ) {

            var msg;
            msg=errorReturn(code);
            layer.alert(msg);
        };
        // 判断文件出错
        uploader3.onError = function( code ) {
            var msg;
            msg=errorReturn(code);
            layer.alert(msg);
        };

        function  errorReturn(code){
            var msg;
            switch (code){
                case 'Q_EXCEED_NUM_LIMIT':
                    msg = '只能上传一个文件';
                    break;
                case 'Q_EXCEED_SIZE_LIMIT':
                    msg = '上传文件大小过大';
                    break;
                case 'Q_TYPE_DENIED':
                    msg = '文件类型上传错误';
                    break;
                default:msg=code;break;
            }
            return msg;
        }


        //上传成功后触发事件;
        uploader1.on('uploadSuccess',function( file, response ){

            layer.alert( '上传成功' );
            $("#geologyDoc").val( response[0].hash);

        });
        //上传成功后触发事件;
        uploader2.on('uploadSuccess',function( file, response ){

            layer.alert( '上传成功' );
            $("#projectDoc").val( response[0].hash);
        });
        //上传成功后触发事件;
        uploader3.on('uploadSuccess',function( file, response ){

            layer.alert( '上传成功' );
            $("#pileDoc").val( response[0].hash);
        });
        //上传失败后触发事件;
        uploader1.on('uploadError',function( file, response ){

            layer.alert( '上传失败' );

        });
        //上传失败后触发事件;
        uploader2.on('uploadError',function( file, response ){

            layer.alert( '上传失败' );
        });
        //上传失败后触发事件;
        uploader3.on('uploadError',function( file, response ){

            layer.alert( '上传失败' );
        });


/*
        uploader1.on( 'all', function( type ) {
            changeState(type,uploader1);
        });
        uploader2.on( 'all', function( type ) {
            changeState(type,uploader2);
        });
        uploader3.on( 'all', function( type ) {
            changeState(type,uploader3);
        });

        function  changeState(type,uploader){
            var stats;
            switch( type ) {
                case 'uploadFinished':
                    setState( 'confirm',uploader );
                    break;

                case 'startUpload':
                    setState( 'uploading',uploader );
                    break;

                case 'stopUpload':
                    setState( 'paused' ,uploader);
                    break;

            }
        }


        function setState( val,uploader ) {
            var stats, state;


            state = val;

            switch ( state ) {
                case 'confirm':
                    stats = uploader.getStats();
                    if ( stats.successNum && !stats.uploadFailNum ) {
                        setState( 'finish' );
                        return;
                    }
                    break;
                case 'finish':
                    stats = uploader.getStats();
                    if ( stats.successNum ) {
                        layer.alert( '上传成功' );
                    } else {
                        // 没有成功的图片，重设
                        state = 'done';
                        location.reload();
                    }
                    break;
            }
        }
*/
        //获取文件类型;
        function getFileTypeClassName(type) {
            var fileType = {};
            var suffix = '_diy_bg';
            fileType['png'] = 'png';
            fileType['jpg'] = 'jpg';
            fileType['css'] = 'css';
            fileType['avi'] = 'avi';
            fileType['eml'] = 'eml';
            fileType['html'] = 'html';
            fileType['ppt'] = 'ppt';
            fileType['mov'] = 'mov';

            fileType['pdf'] = 'pdf';
            fileType['zip'] = 'zip';
            fileType['rar'] = 'rar';
            fileType['csv'] = 'csv';
            fileType['doc'] = 'doc';
            fileType['docx'] = 'doc';
            fileType['xls'] = 'xls';
            fileType['xlsx'] = 'xls';
            fileType['txt'] = 'txt';
            fileType = fileType[type] || 'txt';
            return fileType + suffix;
        }


//    });
//
//})( jQuery );