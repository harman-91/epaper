import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button'; // Assuming you have a Button component
import { Share2, Copy, Check } from 'lucide-react';

export default function ShareButton({ 
  title = "Check this out!", 
  text = "I found this interesting",
  url 
}) {
  const [copied, setCopied] = useState(false);
  const [fallbackOpen, setFallbackOpen] = useState(false);
  const pathname = usePathname();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-default-site.com';
  const shareUrl = url || `${baseUrl}${pathname}`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: shareUrl,
        });
      } catch (err) {
        console.error('Error sharing:', err);
        setFallbackOpen(true); // Fallback on error
      }
    } else {
      setFallbackOpen(true);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleClose = () => {
    setFallbackOpen(false);
  };

  return (
    <div className="relative">
      <Button
        onClick={handleNativeShare}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        aria-label="Share this content"
      >
        <Share2 className="h-4 w-4" />
        Share
      </Button>

      {/* Fallback for desktop or when native share fails */}
      {fallbackOpen && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-white border rounded-lg shadow-lg p-4 z-50">
          <div className="space-y-3">
            {/* Copy Link */}
            <Button
              onClick={handleCopyLink}
              variant="ghost"
              className="w-full justify-start"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </>
              )}
            </Button>

            {/* Social Media Buttons - Row 1 */}
            <div className="flex gap-2 pt-2">
              <a
                href={`https://x.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button variant="outline" className="w-full">
                  X
                </Button>
              </a>
              
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button variant="outline" className="w-full">
                  Facebook
                </Button>
              </a>
            </div>

            {/* Social Media Buttons - Row 2 */}
            <div className="flex gap-2">
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button variant="outline" className="w-full">
                  LinkedIn
                </Button>
              </a>
              
              <a
                href={`https://wa.me/?text=${encodeURIComponent(text + ' ' + shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button variant="outline" className="w-full">
                  WhatsApp
                </Button>
              </a>
            </div>

            {/* Social Media Buttons - Row 3 */}
            <div className="flex gap-2">
              <a
                href={`https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button variant="outline" className="w-full">
                  Reddit
                </Button>
              </a>
              
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button variant="outline" className="w-full">
                  Telegram
                </Button>
              </a>
            </div>

            {/* Email */}
            <a
              href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + ' ' + shareUrl)}`}
              className="block"
            >
              <Button variant="outline" className="w-full">
                Email
              </Button>
            </a>

            {/* Close Button */}
            <Button
              onClick={handleClose}
              variant="ghost"
              className="w-full mt-2"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}