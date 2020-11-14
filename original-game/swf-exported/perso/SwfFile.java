package com.jpexs.decompiler.flash.exporters.swf;

import com.jpexs.decompiler.flash.SWF;
import com.jpexs.decompiler.flash.SWFCompression;
import com.jpexs.decompiler.flash.tags.*;
import com.jpexs.decompiler.flash.types.*;
import com.jpexs.decompiler.flash.types.filters.*;
import com.jpexs.decompiler.flash.types.shaperecords.*;
import com.jpexs.helpers.ByteArrayRange;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@SuppressWarnings("unchecked")
public class SwfFile {

    private RECT objRECT0(SWF swf) {
        RECT result = new RECT();
                result.Xmin = 0;
        result.Xmax = 1800;
        result.Ymin = 0;
        result.Ymax = 3500;
        result.nbits = 13;
        return result;
    }
    
    private SWF swf() {
        SWF swf = new SWF();
                swf.hasEndTag = true;
        swf.displayRect = objRECT0(swf);
        swf.frameRate = 40.0f;
        swf.frameCount = 1;
        swf.version = 9;
        swf.compression = SWFCompression.ZLIB;
        swf.gfx = false;
        return swf;
    }
    
    public SWF getSwf() {
        SWF swf = swf();
        swf.updateCharacters();
        return swf;
    }

    public void saveTo(String fileName) throws IOException {
        SWF swf = getSwf();
        swf.clearModified();
        try (FileOutputStream fos = new FileOutputStream(fileName)) {
            swf.saveTo(fos, SWFCompression.ZLIB);
        }
    }
}
