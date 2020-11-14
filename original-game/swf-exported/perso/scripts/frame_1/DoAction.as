cMax = 5;
pMax = 11;
function log(text)
{
   flash.external.ExternalInterface.call("alert",text);
}
function decode62(n)
{
   if(n >= 48 && n <= 58)
   {
      return n - 48;
   }
   if(n >= 65 && n <= 90)
   {
      return n - 65 + 10;
   }
   if(n >= 97 && n <= 122)
   {
      return n - 97 + 36;
   }
   return 63;
}
function _init(data, ch)
{
   cl = data.split(";");
   var _loc4_ = 1;
   var _loc2_ = 0;
   while(_loc2_ < cl.length)
   {
      var _loc3_ = int(cl[_loc2_]);
      _loc4_ = (_loc4_ * 11 ^ _loc3_) % 2097151;
      cl[_loc2_] = _loc3_;
      _loc2_ = _loc2_ + 1;
   }
   if(ch != null && "" + _loc4_ != ch)
   {
      return undefined;
   }
   if(palette == null || paletteIndex != cl[0])
   {
      initPalette();
   }
   applyRec(this);
}
function initPalette()
{
   var _loc7_ = this.attachMovie("palette","palinst",0);
   if(_loc7_ == null)
   {
      return undefined;
   }
   paletteIndex = cl[0];
   _loc7_.gotoAndStop(cl[0] % _loc7_._totalframes + 1);
   var _loc8_ = _loc7_.getBounds(_loc7_);
   var _loc6_ = new flash.display.BitmapData(_loc8_.xMax,_loc8_.yMax);
   _loc6_.draw(_loc7_);
   _loc7_.removeMovieClip();
   palette = new Array();
   var _loc4_ = 0;
   while(_loc4_ < cMax)
   {
      var _loc3_ = new Array();
      var _loc5_ = _loc4_ * 15 + 7;
      while(true)
      {
         var _loc2_ = _loc6_.getPixel32(_loc3_.length * 15 + 7,_loc5_);
         if(_loc2_ == 0 || _loc2_ == -1)
         {
            break;
         }
         _loc3_.push(_loc2_ & 16777215);
      }
      palette.push(_loc3_);
      _loc4_ = _loc4_ + 1;
   }
   _loc6_.dispose();
}
function applyRec(mc)
{
   for(var _loc7_ in mc)
   {
      var _loc1_ = mc[_loc7_];
      if(typeof _loc1_ == "movieclip")
      {
         if(_loc1_._name.substr(0,2) == "_p")
         {
            var _loc2_ = parseInt(_loc1_._name.substr(2));
            var _loc5_ = cl[_loc2_] % _loc1_._totalframes;
            _loc1_.gotoAndStop(_loc5_ + 1);
         }
         else if(_loc1_._name.substr(0,4) == "_col")
         {
            var _loc3_ = parseInt(_loc1_._name.substr(4));
            var _loc4_ = palette[_loc3_];
            setColor(_loc1_,_loc4_[cl[pMax + _loc3_] % _loc4_.length]);
         }
         applyRec(_loc1_,_loc2_);
      }
   }
}
function setColor(mc, col)
{
   var _loc1_ = {r:col >> 16,g:col >> 8 & 255,b:col & 255};
   var _loc2_ = new Color(mc);
   var _loc3_ = {ra:100,ga:100,ba:100,aa:100,rb:_loc1_.r - 255,gb:_loc1_.g - 255,bb:_loc1_.b - 255,ab:0};
   _loc2_.setTransform(_loc3_);
}
function sec(u)
{
   while(true)
   {
      var _loc1_ = u.charCodeAt(0);
      if(_loc1_ == 13 || _loc1_ == 10 || _loc1_ == 32 || _loc1_ == 9)
      {
         u = u.substr(1);
         continue;
      }
      break;
   }
   if(u.toLowerCase().substr(0,11) == "javascript:")
   {
      return null;
   }
   return u;
}
if(_root.data != null && _root.chk != null)
{
   Stage.align = "TL";
   _init(_root.data,_root.chk);
   if(_root.flip == "1")
   {
      _p0b._xscale = _p0b._xscale * -1;
      _p0b._x = 95;
   }
   if(_root.stop == "1")
   {
      _p0b.sub.stop();
   }
   if(_root.clic != null)
   {
      _p0b.onPress = function()
      {
         getURL(sec(_root.clic),"_self");
      };
   }
   if(_root.head != null)
   {
      _p0b._xscale = _p0b._xscale * 0.5;
      _p0b._yscale = _p0b._yscale * 0.5;
      _p0b._x = _p0b._x - 50;
      _p0b._y = _p0b._y - 8;
   }
}
