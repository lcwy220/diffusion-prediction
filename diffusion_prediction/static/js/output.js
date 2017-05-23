function getExportPath() {  
    var shell = new ActiveXObject("Shell.Application");  
    var folder = shell.BrowseForFolder(0, '请选择存储目录', 0x0040, 0x11);   
    var filePath;  
    if(folder != null) {  
         filePath = folder.Items().Item().Path;  
    }  
    return filePath;  
} 

function output_to_pdf(){
    var filePath = getExportPath();  


    if(filePath != null) {  
        try {  
            var word = new ActiveXObject("Word.Application");  
            var doc = word.Documents.Add("", 0, 1);  
            var range = doc.Range(0, 1);  
            var sel = document.body.createTextRange();  
            try {  
                sel.moveToElementText(content);  
            } catch (notE) {  
                alert("导出数据失败，没有数据可以导出。");  
                window.close();  
                // return;  
            }  
            sel.select();  
            sel.execCommand("Copy");  
            range.Paste();  
            //word.Application.Visible = true;// 控制word窗口是否显示  
            doc.saveAs(filePath + "/导出测试.pdf", 17);// 保存为pdf格式  
            alert("导出成功");  
        } catch (e) {  
            alert("导出数据失败，需要在客户机器安装Microsoft Office Word 2007以上版本，将当前站点加入信任站点，允许在IE中运行ActiveX控件。");  
        } finally {  
            try {word.quit();// 关闭word窗口
            } catch (ex) {}  
        }  
    } 
}

