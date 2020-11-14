var wid = _parent._parent._parent._wid;
if(wid == null)
{
   wid = _parent._parent._parent._parent._wid;
}
gotoAndStop(wid + 1);
stop();
