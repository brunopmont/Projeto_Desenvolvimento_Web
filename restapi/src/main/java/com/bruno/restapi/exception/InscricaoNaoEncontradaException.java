package com.bruno.restapi.exception;

public class InscricaoNaoEncontradaException extends Exception {

    private static final long serialVersionUID = 1L;

    private int codigo;

    public InscricaoNaoEncontradaException(String msg) {
        super(msg);
    }

    public InscricaoNaoEncontradaException(int codigo, String msg) {
        super(msg);
        this.codigo = codigo;
    }

    public int getCodigoDeErro() {
        return codigo;
    }
}