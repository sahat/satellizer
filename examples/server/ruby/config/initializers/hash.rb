class Hash
  def except(*blacklist)
    reject {|key, value| blacklist.include?(key) }
  end

  def only(*whitelist)
    reject {|key, value| !whitelist.include?(key) }
  end

  def smash(prefix = nil)
    inject({}) do |acc, (k, v)|
      Hash === v ? acc.merge(v.smash(k)) : acc.merge(k => v)
    end
  end

end