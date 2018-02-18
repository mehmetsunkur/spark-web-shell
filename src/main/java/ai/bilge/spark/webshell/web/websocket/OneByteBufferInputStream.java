package ai.bilge.spark.webshell.web.websocket;

import org.glassfish.jersey.internal.util.collection.ByteBufferInputStream;

import java.io.IOException;
import java.io.InputStream;
import java.nio.ByteBuffer;

/**
 * Created by mehmetsunkur on 2/18/18.
 * Blocks the thread while waiting input from user
 *
 */
public class OneByteBufferInputStream extends InputStream {

    private ByteBufferInputStream byteBufferInputStream = new ByteBufferInputStream();

    public OneByteBufferInputStream() {
        super();
    }

    public boolean put(final ByteBuffer src) throws InterruptedException {
        return this.byteBufferInputStream.put(src);
    }

    @Override
    public int read(byte[] b) throws IOException {
        return byteBufferInputStream.read(b);
    }

    //Read only one byte instead given length
    @Override
    public int read(byte[] b, int off, int len) throws IOException {
        return byteBufferInputStream.read(b, off, 1);
    }

    @Override
    public long skip(long n) throws IOException {
        return byteBufferInputStream.skip(n);
    }

    @Override
    public int available() throws IOException {
        return byteBufferInputStream.available();
    }

    @Override
    public void close() throws IOException {
        byteBufferInputStream.close();
    }

    @Override
    public synchronized void mark(int readlimit) {
        byteBufferInputStream.mark(readlimit);
    }

    @Override
    public synchronized void reset() throws IOException {
        byteBufferInputStream.reset();
    }

    @Override
    public boolean markSupported() {
        return byteBufferInputStream.markSupported();
    }

    @Override
    public int read() throws IOException {
        return byteBufferInputStream.read();
    }
}
